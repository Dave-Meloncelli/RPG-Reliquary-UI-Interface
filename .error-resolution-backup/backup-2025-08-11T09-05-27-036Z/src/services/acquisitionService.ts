import type { AcquisitionProgress, AcquisitionStep } from '../types/types';

// Simple stub for acquisition pipeline
export async function* runAcquisitionPipeline(frontImageDataUrl: string, backImageDataUrl: string): AsyncGenerator<AcquisitionProgress> {
    console.warn('runAcquisitionPipeline is stubbed - implement when needed');
    
    const mockSteps: AcquisitionStep[] = [
        { 
            id: '1',
            name: 'OCR & Dimension Extraction',
            description: 'Extracting text and measuring dimensions from images', 
            status: 'pending',
            progress: 0
        },
        { 
            id: '2',
            name: 'Condition Assessment',
            description: 'Analyzing physical condition and wear patterns',
            status: 'pending',
            progress: 0
        },
        { 
            id: '3',
            name: 'Market Intelligence',
            description: 'Researching market value and demand data', 
            status: 'pending',
            progress: 0
        }
    ];

    let progress: AcquisitionProgress = {
        id: 'mock-acq-' + Date.now(),
        status: 'scanning',
        currentStep: mockSteps[0],
        progress: 0,
        errors: [],
        startTime: new Date()
    };

    yield { ...progress };
    
    // Simulate progress
    for (let i = 0; i < mockSteps.length; i++) {
        mockSteps[i].status = 'running';
        progress.currentStep = mockSteps[i];
        progress.progress = ((i + 1) / mockSteps.length) * 100;
        
        yield { ...progress };
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        mockSteps[i].status = 'completed';
        mockSteps[i].progress = 100;
    }
    
    progress.status = 'complete';
    progress.progress = 100;
    yield { ...progress };
}
