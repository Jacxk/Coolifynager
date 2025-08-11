import {
  Href,
  router,
  type RelativePathString,
  type UnknownInputParams,
} from "expo-router";

/**
 * Navigate to a pathname.
 * - Absolute paths (starting with "/") are pushed once directly.
 * - Relative paths (e.g., "./deployments/logs" or "deployments/logs") are navigated step-by-step.
 *   For example, "./deployments/logs" will push to "./deployments" first, then to "./deployments/logs".
 */
export async function navigatePath(
  href: Href,
  options?: {
    delayMsPerStep?: number;
  }
): Promise<void> {
  const delayMs = options?.delayMsPerStep ?? 10;

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

  if (!href) return;

  if (typeof href !== "string") {
    const { pathname, params } = href;
    if (typeof pathname === "string" && pathname.trim().startsWith("./")) {
      await stepThroughRelative(pathname, params, delayMs, sleep);
      return;
    }
    router.push(href);
    return;
  }

  const path = href.trim();
  if (path.length === 0) return;

  if (path.startsWith("/")) {
    router.push({ pathname: path } as Href);
    return;
  }

  await stepThroughRelative(path, undefined, delayMs, sleep);
}

function splitPathAndTrailing(path: string): {
  base: string;
  trailing: string;
} {
  const qIndex = path.indexOf("?");
  const hIndex = path.indexOf("#");
  const cutIndex = Math.min(
    qIndex === -1 ? Number.POSITIVE_INFINITY : qIndex,
    hIndex === -1 ? Number.POSITIVE_INFINITY : hIndex
  );
  if (!Number.isFinite(cutIndex)) return { base: path, trailing: "" };
  return { base: path.slice(0, cutIndex), trailing: path.slice(cutIndex) };
}

async function stepThroughRelative(
  relativePath: string,
  finalParams: UnknownInputParams | undefined,
  delayMs: number,
  sleep: (ms: number) => Promise<void>
): Promise<void> {
  const trimmed = relativePath.trim();
  const withoutDot = trimmed.replace(/^\.\/?/, "");
  const { base, trailing } = splitPathAndTrailing(
    withoutDot.replace(/\/+/, "/").replace(/\/$/, "")
  );
  if (base.length === 0) return;

  const parts = base
    .split("/")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== ".");

  let cumulative = "";
  for (let i = 0; i < parts.length; i++) {
    const segment = parts[i];
    const isLast = i === parts.length - 1;
    cumulative = cumulative ? `${cumulative}/${segment}` : `./${segment}`;
    const pathname = (
      isLast ? `${cumulative}${trailing}` : cumulative
    ) as RelativePathString;
    router.push({ pathname, params: isLast ? finalParams : undefined } as Href);
    // eslint-disable-next-line no-await-in-loop
    if (delayMs > 0) await sleep(delayMs);
  }
}
