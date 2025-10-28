import { Router } from "express";
import { prisma } from "../prisma";
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const router = Router();

// Proteger todas las rutas de tareas
router.use(authMiddleware);

// Obtener todas las tareas del usuario
router.get("/", async (req: AuthRequest, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" }
  });
  res.json(tasks);
});

// Crear una nueva tarea
router.post("/", async (req: AuthRequest, res) => {
  const { title, description, priority, dueDate } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.userId!
    }
  });
  res.status(201).json(task);
});

// Actualizar una tarea
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, priority, dueDate, completed } = req.body;
  const task = await prisma.task.update({
    where: { id },
    data: { title, description, priority, dueDate, completed }
  });
  res.json(task);
});

// Eliminar una tarea
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
});

export default router;
