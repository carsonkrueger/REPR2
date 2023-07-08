export const getCurDate = () => {
  return new Date().toISOString().split("T")[0];
};
