const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

exports.auth = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return res.status(401).json({ message: "Acesso negado." })

    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token inválido ou expirado." })
    }
}
