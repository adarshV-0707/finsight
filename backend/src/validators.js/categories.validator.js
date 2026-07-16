const VALID_CATEGORY_TYPES = ["income", "expense"];

const validateCategoryName = (name) => {
  if (typeof name !== "string" || !name.trim()) {
    return "Category name is required";
  }

  if (name.trim().length > 100) {
    return "Category name cannot exceed 100 characters";
  }

  return null;
};

const validateCategoryType = (type) => {
  if (!VALID_CATEGORY_TYPES.includes(type)) {
    return "Category type must be either income or expense";
  }

  return null;
};

const validateCreateCategory = (body) => {
  const { name, type } = body;

  const nameError = validateCategoryName(name);

  if (nameError) {
    return { error: nameError };
  }

  const typeError = validateCategoryType(type);

  if (typeError) {
    return { error: typeError };
  }

  return {
    error: null,
    data: {
      name: name.trim(),
      type,
    },
  };
};

const validateUpdateCategory = (body) => {
  const updates = {};

  if ("name" in body) {
    const nameError = validateCategoryName(body.name);

    if (nameError) {
      return { error: nameError };
    }

    updates.name = body.name.trim();
  }

  if ("type" in body) {
    const typeError = validateCategoryType(body.type);

    if (typeError) {
      return { error: typeError };
    }

    updates.type = body.type;
  }

  if (Object.keys(updates).length === 0) {
    return {
      error: "At least one category field is required for update",
    };
  }

  return {
    error: null,
    data: updates,
  };
};

const isValidCategoryType = (type) => {
  return VALID_CATEGORY_TYPES.includes(type);
};

export {
  validateCreateCategory,
  validateUpdateCategory,
  isValidCategoryType,
};