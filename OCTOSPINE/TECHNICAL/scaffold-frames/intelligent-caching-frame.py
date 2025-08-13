#!/usr/bin/env python3
"""
Intelligent Caching Frame
Manages intelligent caching for repeated operations to improve performance
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import traceback
import hashlib
import time
import shutil
from collections import OrderedDict

class CacheEntry:
    """Represents a cache entry"""
    
    def __init__(self, key: str, data: Any, ttl: int = 3600):
        self.key = key
        self.data = data
        self.created_at = datetime.now()
        self.last_accessed = datetime.now()
        self.access_count = 0
        self.ttl = ttl  # Time to live in seconds
        self.size = self._calculate_size()
    
    def _calculate_size(self) -> int:
        """Calculate approximate size of cache entry"""
        try:
            if isinstance(self.data, str):
                return len(self.data.encode('utf-8'))
            elif isinstance(self.data, dict):
                return len(json.dumps(self.data, ensure_ascii=False).encode('utf-8'))
            elif isinstance(self.data, list):
                return len(json.dumps(self.data, ensure_ascii=False).encode('utf-8'))
            else:
                return len(str(self.data).encode('utf-8'))
        except Exception as e:
            return 1024  # Default size
    
    def is_expired(self) -> bool:
        """Check if cache entry is expired"""
        return (datetime.now() - self.created_at).total_seconds() > self.ttl
    
    def access(self):
        """Mark entry as accessed"""
        self.last_accessed = datetime.now()
        self.access_count += 1
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return {
            "key": self.key,
            "data": self.data,
            "created_at": self.created_at.isoformat(),
            "last_accessed": self.last_accessed.isoformat(),
            "access_count": self.access_count,
            "ttl": self.ttl,
            "size": self.size
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CacheEntry':
        """Create from dictionary"""
        entry = cls(data["key"], data["data"], data["ttl"])
        entry.created_at = datetime.fromisoformat(data["created_at"])
        entry.last_accessed = datetime.fromisoformat(data["last_accessed"])
        entry.access_count = data["access_count"]
        entry.size = data["size"]
        return entry

class IntelligentCache:
    """Intelligent caching system with LRU eviction and TTL"""
    
    def __init__(self, cache_path: str = "intelligent_cache", max_size_mb: int = 100):
        self.cache_path = Path(cache_path)
        self.cache_path.mkdir(exist_ok=True)
        
        # Cache configuration
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.current_size_bytes = 0
        
        # Cache storage
        self.cache_index_path = self.cache_path / "cache_index.json"
        self.cache_entries: OrderedDict[str, CacheEntry] = OrderedDict()
        
        # Statistics
        self.stats = {
            "hits": 0,
            "misses": 0,
            "evictions": 0,
            "total_requests": 0
        }
        
        # Load existing cache
        self._load_cache()
    
    def _load_cache(self):
        """Load cache from disk"""
        if self.cache_index_path.exists():
            try:
                with open(self.cache_index_path, 'r', encoding='utf-8') as f:
                    cache_data = json.load(f)
                
                # Load cache entries
                for key, entry_data in cache_data.get("entries", {}).items():
                    entry = CacheEntry.from_dict(entry_data)
                    if not entry.is_expired():
                        self.cache_entries[key] = entry
                        self.current_size_bytes += entry.size
                
                # Load statistics
                self.stats = cache_data.get("stats", self.stats)
                
                print(f"📦 Loaded {len(self.cache_entries)} cache entries ({self.current_size_bytes / 1024 / 1024:.1f}MB)")
                
            except Exception as e:
                print(f"⚠️  Could not load cache: {e}")
    
    def _save_cache(self):
        """Save cache to disk"""
        try:
            cache_data = {
                "entries": {key: entry.to_dict() for key, entry in self.cache_entries.items()},
                "stats": self.stats,
                "last_updated": datetime.now().isoformat()
            }
            
            with open(self.cache_index_path, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            print(f"⚠️  Could not save cache: {e}")
    
    def _generate_key(self, operation: str, parameters: Dict[str, Any]) -> str:
        """Generate cache key from operation and parameters"""
        # Create a deterministic string representation
        param_str = json.dumps(parameters, sort_keys=True, ensure_ascii=False)
        key_data = f"{operation}:{param_str}"
        
        # Generate hash for consistent key
        return hashlib.md5(key_data.encode('utf-8')).hexdigest()
    
    def get(self, operation: str, parameters: Dict[str, Any]) -> Optional[Any]:
        """Get data from cache"""
        key = self._generate_key(operation, parameters)
        self.stats["total_requests"] += 1
        
        if key in self.cache_entries:
            entry = self.cache_entries[key]
            
            # Check if expired
            if entry.is_expired():
                del self.cache_entries[key]
                self.current_size_bytes -= entry.size
                self.stats["misses"] += 1
                return None
            
            # Mark as accessed and move to end (LRU)
            entry.access()
            self.cache_entries.move_to_end(key)
            self.stats["hits"] += 1
            
            return entry.data
        
        self.stats["misses"] += 1
        return None
    
    def set(self, operation: str, parameters: Dict[str, Any], data: Any, ttl: int = 3600) -> bool:
        """Set data in cache"""
        key = self._generate_key(operation, parameters)
        
        # Create cache entry
        entry = CacheEntry(key, data, ttl)
        
        # Check if we need to evict entries
        while self.current_size_bytes + entry.size > self.max_size_bytes and self.cache_entries:
            self._evict_lru_entry()
        
        # Add entry
        self.cache_entries[key] = entry
        self.current_size_bytes += entry.size
        
        return True
    
    def _evict_lru_entry(self):
        """Evict least recently used entry"""
        if not self.cache_entries:
            return
        
        # Remove oldest entry (first in OrderedDict)
        key, entry = self.cache_entries.popitem(last=False)
        self.current_size_bytes -= entry.size
        self.stats["evictions"] += 1
    
    def invalidate(self, operation: str = None, parameters: Dict[str, Any] = None) -> int:
        """Invalidate cache entries"""
        if operation is None and parameters is None:
            # Clear all cache
            invalidated_count = len(self.cache_entries)
            self.cache_entries.clear()
            self.current_size_bytes = 0
            return invalidated_count
        
        if operation is not None:
            # Invalidate by operation prefix
            invalidated_keys = []
            for key in list(self.cache_entries.keys()):
                if key.startswith(hashlib.md5(operation.encode('utf-8')).hexdigest()[:8]):
                    invalidated_keys.append(key)
            
            for key in invalidated_keys:
                entry = self.cache_entries.pop(key)
                self.current_size_bytes -= entry.size
            
            return len(invalidated_keys)
        
        return 0
    
    def cleanup_expired(self) -> int:
        """Remove expired entries"""
        expired_keys = []
        
        for key, entry in self.cache_entries.items():
            if entry.is_expired():
                expired_keys.append(key)
        
        for key in expired_keys:
            entry = self.cache_entries.pop(key)
            self.current_size_bytes -= entry.size
        
        return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        hit_rate = self.stats["hits"] / max(self.stats["total_requests"], 1)
        
        return {
            "entries_count": len(self.cache_entries),
            "current_size_mb": self.current_size_bytes / 1024 / 1024,
            "max_size_mb": self.max_size_bytes / 1024 / 1024,
            "hit_rate": hit_rate,
            "hits": self.stats["hits"],
            "misses": self.stats["misses"],
            "evictions": self.stats["evictions"],
            "total_requests": self.stats["total_requests"]
        }
    
    def get_cache_info(self) -> List[Dict[str, Any]]:
        """Get information about cache entries"""
        cache_info = []
        
        for key, entry in self.cache_entries.items():
            cache_info.append({
                "key": key,
                "size_bytes": entry.size,
                "access_count": entry.access_count,
                "created_at": entry.created_at.isoformat(),
                "last_accessed": entry.last_accessed.isoformat(),
                "ttl_seconds": entry.ttl,
                "is_expired": entry.is_expired()
            })
        
        # Sort by last accessed (most recent first)
        cache_info.sort(key=lambda x: x["last_accessed"], reverse=True)
        return cache_info

class CacheManager:
    """Manages intelligent caching operations"""
    
    def __init__(self, cache_path: str = "intelligent_cache"):
        self.cache = IntelligentCache(cache_path)
        self.operation_patterns = {
            "file_analysis": {"ttl": 1800, "max_size": 1024 * 1024},  # 30 minutes
            "dependency_scan": {"ttl": 3600, "max_size": 512 * 1024},  # 1 hour
            "pattern_analysis": {"ttl": 7200, "max_size": 2048 * 1024},  # 2 hours
            "meta_analysis": {"ttl": 3600, "max_size": 1024 * 1024},  # 1 hour
            "knowledge_hub": {"ttl": 14400, "max_size": 4096 * 1024},  # 4 hours
            "default": {"ttl": 1800, "max_size": 512 * 1024}  # 30 minutes
        }
    
    def get_cached_result(self, operation: str, parameters: Dict[str, Any]) -> Optional[Any]:
        """Get cached result for operation"""
        return self.cache.get(operation, parameters)
    
    def cache_result(self, operation: str, parameters: Dict[str, Any], result: Any) -> bool:
        """Cache result for operation"""
        config = self.operation_patterns.get(operation, self.operation_patterns["default"])
        return self.cache.set(operation, parameters, result, config["ttl"])
    
    def get_or_compute(self, operation: str, parameters: Dict[str, Any], compute_func: callable) -> Any:
        """Get cached result or compute and cache"""
        
        # Try to get from cache first
        cached_result = self.get_cached_result(operation, parameters)
        if cached_result is not None:
            return cached_result
        
        # Compute result
        result = compute_func()
        
        # Cache result
        self.cache_result(operation, parameters, result)
        
        return result
    
    def invalidate_operation(self, operation: str) -> int:
        """Invalidate all cache entries for an operation"""
        return self.cache.invalidate(operation=operation)
    
    def cleanup(self) -> Dict[str, int]:
        """Clean up expired entries and return statistics"""
        expired_count = self.cache.cleanup_expired()
        
        return {
            "expired_entries_removed": expired_count,
            "current_entries": len(self.cache.cache_entries),
            "current_size_mb": self.cache.current_size_bytes / 1024 / 1024
        }
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get comprehensive cache statistics"""
        return self.cache.get_stats()
    
    def get_cache_info(self) -> List[Dict[str, Any]]:
        """Get detailed cache information"""
        return self.cache.get_cache_info()

def run_intelligent_caching(context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Main function to run intelligent caching operations"""
    
    if context is None:
        context = {}
    
    print("💾 Running Intelligent Caching...")
    
    try:
        # Initialize cache manager
        cache_manager = CacheManager()
        
        # Get operation from context
        operation = context.get("operation", "default")
        parameters = context.get("parameters", {})
        data = context.get("data", None)
        
        if operation == "get":
            # Get cached data
            cached_data = cache_manager.get_cached_result(parameters.get("operation", "default"), 
                                                        parameters.get("params", {}))
            
            result = {
                "success": True,
                "cached_data_found": cached_data is not None,
                "cached_data": cached_data
            }
            
        elif operation == "set":
            # Set cache data
            success = cache_manager.cache_result(parameters.get("operation", "default"),
                                               parameters.get("params", {}),
                                               data)
            
            result = {
                "success": success,
                "data_cached": success,
                "cache_key": cache_manager.cache._generate_key(parameters.get("operation", "default"),
                                                             parameters.get("params", {}))
            }
            
        elif operation == "cleanup":
            # Clean up expired entries
            cleanup_stats = cache_manager.cleanup()
            
            result = {
                "success": True,
                "cleanup_complete": True,
                "cleanup_stats": cleanup_stats
            }
            
        elif operation == "invalidate":
            # Invalidate cache entries
            invalidated_count = cache_manager.invalidate_operation(parameters.get("operation", ""))
            
            result = {
                "success": True,
                "invalidation_complete": True,
                "invalidated_entries": invalidated_count
            }
            
        else:
            # Default: get cache statistics
            stats = cache_manager.get_cache_stats()
            cache_info = cache_manager.get_cache_info()
            
            result = {
                "success": True,
                "cache_stats": stats,
                "cache_info": cache_info[:10],  # Top 10 entries
                "total_entries": len(cache_info)
            }
        
        # Add cache statistics to result
        result["cache_stats"] = cache_manager.get_cache_stats()
        result["timestamp"] = datetime.now().isoformat()
        
        # Save detailed report
        report_path = f"reports/intelligent_caching_{int(datetime.now().timestamp())}.json"
        os.makedirs("reports", exist_ok=True)
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        # Print cache statistics
        stats = result["cache_stats"]
        print(f"💾 Cache Statistics:")
        print(f"   • Entries: {stats['entries_count']}")
        print(f"   • Size: {stats['current_size_mb']:.1f}MB / {stats['max_size_mb']:.1f}MB")
        print(f"   • Hit Rate: {stats['hit_rate']:.1%}")
        print(f"   • Hits: {stats['hits']}, Misses: {stats['misses']}")
        print(f"📄 Report saved: {report_path}")
        
        return result
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Intelligent caching failed: {str(e)}",
            "traceback": traceback.format_exc(),
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"❌ Error: {error_result['error']}")
        return error_result

if __name__ == "__main__":
    # Test the frame with sample operations
    test_context = {
        "operation": "set",
        "parameters": {
            "operation": "test_operation",
            "params": {"test": True, "data": "sample"}
        },
        "data": {"result": "cached_data", "timestamp": datetime.now().isoformat()}
    }
    
    result = run_intelligent_caching(test_context)
    print(json.dumps(result, indent=2))
