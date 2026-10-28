// src/hooks/usePrevious.ts
import { useRef, useEffect } from "react";
// Generic T -- works for any state type (string, number, User, etc.)
function usePrevious<T>(value: T): T | undefined {
// useRef<T>() alone will NOT compile -- it needs an initial value
const ref = useRef<T | undefined>(undefined);
useEffect(() => {
ref.current = value;
}, [value]);
// The classic usePrevious pattern: read-only, and always one render
// behind, since the effect above only runs after this render commits.
// eslint-disable-next-line react-hooks/refs
return ref.current;
}
export default usePrevious;