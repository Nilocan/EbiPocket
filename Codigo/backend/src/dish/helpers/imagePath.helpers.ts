export const getDishImagePath = (image: string) => {
  return `${process.env.API_URL}${image ?? 'defaultDish.jpg'}`;
};
