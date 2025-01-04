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
  let lastFrameTime = Date.now() * 0.001;
  let firstFrameTime = Date.now() * 0.001;

  const runnner = () => {
    requestAnimationFrame(runnner);

    const currentTime = Date.now() * 0.001;

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