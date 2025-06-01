 export const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
};