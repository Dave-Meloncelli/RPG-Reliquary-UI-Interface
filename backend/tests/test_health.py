import os
import sys
import pytest
from httpx import AsyncClient
from httpx import ASGITransport

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
from backend.app.main import app


@pytest.mark.asyncio
async def test_liveness():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/liveness")
        assert resp.status_code == 200
        assert resp.json()["status"] == "alive"


@pytest.mark.asyncio
async def test_readiness():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        resp = await ac.get("/readiness")
        assert resp.status_code in (200, 503)
        assert "status" in resp.json()

