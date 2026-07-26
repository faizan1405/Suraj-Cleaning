export const cn = (...classes: (string | boolean | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");
