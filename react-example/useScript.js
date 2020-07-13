import { useEffect, useState, useCallback } from "react";

const cachedScripts = [];

const useScript = ({
  src,
  callBack = () => {},
  async = true,
  defer = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
    if (callBack) {
      callBack();
    }
  }, [setIsLoaded, callBack]);

  const handleError = useCallback(() => setHasError(true), [setHasError]);

  useEffect(() => {
    if (cachedScripts.includes(src)) {
      handleLoaded();
      return () => {};
    }
    cachedScripts.push(src);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = async;
    script.defer = defer;

    script.addEventListener("load", handleLoaded);
    script.addEventListener("error", handleError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoaded);
      script.removeEventListener("error", handleError);
    };
  }, [src, async, defer, handleLoaded, handleError]);

  return [isLoaded, hasError];
};

export default useScript;
