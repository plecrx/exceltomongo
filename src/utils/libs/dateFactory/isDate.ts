const isDate = (d: Date | number) => {
	return d instanceof Date && !isNaN(Number(d));
};

export default isDate;
