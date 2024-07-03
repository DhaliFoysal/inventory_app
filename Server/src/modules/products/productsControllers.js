const postProduct = async (req, res, next) => {
  try {
    console.log('postProduct');
  } catch (error) {
    next(error);
  }
};

const getAllProduct = async (req, res, next) => {
    console.log('getAllProduct');
  try {
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const patchProduct = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getProductBarcode = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getIsBarcode = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getAllByNameForDropdown = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};


module.exports = {
    postProduct,
    getAllProduct,
    getProductById,
    patchProduct,
    deleteProduct,
    getProductBarcode,
    getIsBarcode,
    getAllByNameForDropdown
}