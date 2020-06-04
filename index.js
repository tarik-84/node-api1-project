const express = require("express")



const server = express();
server.use(express.json());

let users = [
  {
      id: "1",
      name: "Jane Doe",
      bio: "Not Tarzan's Wife, another Jane"
  }
];

server.get("/users", (req, res) => {
    res.json(users)
})

function getUserById(id) {
	return users.find(u => u.id === id)
}

server.get("/users/:id", (req, res) => {
    const user = getUserById(req.params.id)
    if(user) {
        res.json(user)
    }else {
        res.status(404).json({
            message: "user not found"
        })
    }
})

function createUser(data) {
	const payload = {
		id: String(users.length + 1),
		...data,
	}

	users.push(payload)
	return payload
}


server.post("/users", (req, res) => {
    const { name, bio } = req.body;
    
    if (!name || !bio) {
        return res.status(400).json({
            message: "Please provide name and bio for the user."
        })
    }else {
        const newUser = createUser({
            name: req.body.name,
            bio: req.body.bio
        })
        res.status(201).json(newUser)
    }
})

server.put("/users/:id", (req, res) => {
    const {id} = req.params
    const { name, bio } =req.body;
    const findUserById = user => {
        return user.id == id;
      };
      const foundUser = users.find(findUserById);
      if (!foundUser) {
        return res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
      } else {
        if (name) foundUser.name = name;
        if (bio) foundUser.bio = bio;
        res.json(users);
      } 
})

function deleteUser(id) {
	users = users.filter(u => u.id != id)
}

server.delete("/users/:id", (req, res) => {
	const user = getUserById(req.params.id)

	if (user) {
		deleteUser(user.id)
		
		res.status(204).end()
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})


server.listen(5000, () => {
	console.log("server is listening on port 5000")
})
