import { useEffect, useRef, useState } from "react";

/**
 * Renders `children` only once the slot nears the viewport.
 *
 * lazy() alone splits code but does not delay it: a lazy component that is
 * rendered immediately fetches AND executes immediately. The homepage mounted
 * nine below-fold sections at once — including a whole rank predictor and its
 * charting library — so everything downloaded and ran during load. That's
 * blocking time spent on pixels nobody has scrolled to yet.
 *
 * `rootMargin` starts the work well before the section is visible, so by the
 * time it scrolls into view it's already there and nothing appears to load.
 *
 * `minHeight` reserves the slot so deferring doesn't shift the page. It doesn't
 * need to match the final height exactly — the section is off-screen when it
 * fills in, and CLS only counts shifts inside the viewport — but a sane value
 * keeps the scrollbar from jumping around.
 */
export default function Defer({ children, minHeight = 420, rootMargin = "600px" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers): render rather than show nothing.
    if (typeof IntersectionObserver === "undefined") { setShow(true); return; }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
