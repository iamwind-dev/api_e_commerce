module.exports = function paginate(q) {
  const page = Math.max(1, parseInt(q.page || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(q.limit || "10", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip, take: limit };
};
