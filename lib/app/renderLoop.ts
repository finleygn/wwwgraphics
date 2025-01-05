export interface RenderLoopTimeData {
  elapsed: number;
  dt: number;
}

export interface RenderLoopOptions {
  longestFrame: number;
}

export type RenderLoopCallback = (data: RenderLoopTimeData) => void

/**
 * Render loop that calls a callback once per frame.
 * 
 * @param callback the callback to call once per frame
 * @param options the options for the render loop
 */
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

    // Cap the delta time to the longest frame time.
    if (dt > longestFrame) {
      dt = longestFrame
    };

    lastFrameTime = currentTime;

    callback({ elapsed: lastFrameTime - firstFrameTime, dt });
  }
  
  runnner();
}

export default renderLoop;