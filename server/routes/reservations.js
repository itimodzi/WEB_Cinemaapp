const router = require("express").Router();
const authorization = require("../middleware/authorization");
const pool = require("../db");

// Assigning tickets to a user
router.post("/:id", authorization, async (req, res) => {
	try {
		const user_id = req.params.id;
		const showtime_id = req.body.shId;
		const booked_seats = req.body.bookedSeats;
		const start_date = req.body.selectedDate;
		const total = req.body.total;

		const newReservation = await pool.query(
			"INSERT INTO reservations (user_id, showtime_id, booked_seats, total) VALUES ($1, $2, $3, $4) RETURNING *",
			[user_id, showtime_id, booked_seats, total]
		);




		res.json(newReservation.rows[0]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});


// Get all tickets by user id
router.get("/user/:id", authorization, async (req, res) => {
	const { id } = req.params;
	try {
		const response = await pool.query(
			`SELECT r.*, s.show_date, s.start_at, s.ticket_price, m.movie_title, m.image_url
			FROM reservations r
			JOIN showtimes s ON r.showtime_id = s.showtime_id
			JOIN movies m ON s.movie_id = m.movie_id
			WHERE r.user_id = $1
			ORDER BY r.reservation_date DESC`,
			[id]
		);

		res.json(response.rows);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
