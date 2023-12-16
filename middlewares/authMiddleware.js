const jwt = require('jsonwebtoken');

module.exports = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error(err); 
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
    
      if (!decoded || decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
    

      req.user = {
        userId: decoded._id,
        role: decoded.role,
      };
    


    
      next();
    });
  }
}
