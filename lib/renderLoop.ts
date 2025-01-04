export interface RenderLoopTimeData {
  elapsed: number;
  dt: number;
}

export interface RenderLoopOptions {
  longestFrame: number;
}

type RenderLoopCallback = (data: RenderLoopTimeData) => void

function renderLoop(
  callback: RenderLoopCallback,
  { longestFrame = 50 }: RenderLoopOptions
) {
  let lastFrameTime = Date.now();
  let firstFrameTime = Date.now();

  const runnner = () => {
    requestAnimationFrame(runnner);

    const currentTime = Date.now();

    let dt = currentTime - lastFrameTime;
    if (dt > longestFrame) {
      dt = longestFrame
    };

    lastFrameTime = currentTime;

    callback({ elapsed: lastFrameTime - firstFrameTime, dt });
  }
  
  runnner();
}

export default renderLoop;