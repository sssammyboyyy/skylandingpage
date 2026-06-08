import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { url, niche = "Boutique Hotels", location = "South Africa" } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 });
    }

    // Use join to prevent Turbopack from attempting to statically bundle the external script
    const scriptPath = [process.cwd(), '..', 'scripts', 'revops', 'run_pipeline.js'].join(path.sep);
    const rootCwd = [process.cwd(), '..'].join(path.sep);
    console.log("Spawning pipeline:", scriptPath, url, niche, location);

    const child = spawn('node', [scriptPath, url, niche, location], {
      cwd: rootCwd, // Run from AIBoyz root
      env: { ...process.env } // Pass env vars
    });

    const stream = new ReadableStream({
      start(controller) {
        const sendEvent = (data: any) => {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        child.stdout.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          lines.forEach((line: string) => {
            if (line.trim()) {
               let phase = null;
               if (line.includes('--- STEP 1:')) phase = 1;
               else if (line.includes('--- STEP 1B:')) phase = 2;
               else if (line.includes('--- STEP 2:')) phase = 3;
               else if (line.includes('--- STEP 3:')) phase = 4;
               else if (line.includes('--- STEP 4:')) phase = 5;

               sendEvent({ type: 'log', message: line, phase });
            }
          });
        });

        child.stderr.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          lines.forEach((line: string) => {
            if (line.trim()) {
               sendEvent({ type: 'log', message: `ERROR: ${line}`, isError: true });
            }
          });
        });

        child.on('close', (code) => {
          sendEvent({ type: 'complete', code });
          controller.close();
        });

        child.on('error', (err) => {
          sendEvent({ type: 'log', message: `PROCESS ERROR: ${err.message}`, isError: true });
          controller.close();
        });
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
