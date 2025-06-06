const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validinfo = require("../middleware/validinfo");
const authorization = require("../middleware/authorization");

// Регистрация
router.post("/register", validinfo, async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email,
		]);

		if (user.rows.length !== 0) {
			return res.status(401).json("You alredy registered!");
		}
		// Шифрование пароля
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const bcryptPassword = await bcrypt.hash(password, salt);

		// Новый пользователь
		const newUser = await pool.query(
			"INSERT INTO users (user_email, user_password) VALUES ($1, $2) RETURNING *",
			[email, bcryptPassword]
		);
		// Генерирование токена
		const token = jwtGenerator(newUser.rows[0].user_id);

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.starus(500).send("Server Error");
	}
});

// Логин
router.post("/login", validinfo, async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
			email,
		]);
		if (user.rows.length === 0) {
			return res.status(401).json("Invalid email or password!");
		}

		const validPassword = await bcrypt.compare(
			password,
			user.rows[0].user_password
		);
		if (!validPassword) {
			return res.status(401).json("Invalid email or password!");
		}
		const token = jwtGenerator(user.rows[0].user_id);

		res.json({ token });
	} catch (err) {
		console.error(err.message);
		res.starus(500).send("Server Error");
	}
});

// Проверка входа
router.get("/is-verify", authorization, async (req, res) => {
	try {
		res.json(true);
	} catch (err) {
		console.error(err.message);
		res.starus(500).send("Server Error");
	}
});

module.exports = router;
