const validateFullFields = (array) =>
	array.every((element) => element !== '' && element !== null && element !== undefined);

export { validateFullFields };
