import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((issue) => {
    const issueName = issue.path.join('.');

    if (issueName in errors) {
      errors[issueName].push(issue.message);
    } else {
      errors[issueName] = [issue.message];
    }
  });

  return errors;
}
