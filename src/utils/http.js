exports.ok = (res, data) => res.status(200).json({ success: true, data });
exports.created = (res, data) => res.status(201).json({ success: true, data });
exports.noContent = (res) => res.status(204).send();
exports.badRequest = (res, message, errors) =>
  res.status(400).json({ success: false, message, errors });
exports.unauthorized = (res, message = "Unauthorized") =>
  res.status(401).json({ success: false, message });
exports.forbidden = (res, message = "Forbidden") =>
  res.status(403).json({ success: false, message });
exports.notFound = (res, message = "Not found") =>
  res.status(404).json({ success: false, message });
