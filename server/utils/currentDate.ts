const currentDate = (): string => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  return `${dd < 10 ? "0" + dd : dd}-${mm < 10 ? "0" + mm : mm}-${yyyy}`;
};

export default currentDate;
