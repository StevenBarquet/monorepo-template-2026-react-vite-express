import express from "express";

const router = express.Router();

router.post("/", logic);

type Item = {
  id: number;
  name: string;
  createdAt: string;
};

const mockItems: Item[] = [
  { id: 1, name: "First item", createdAt: "2026-01-15T10:00:00Z" },
  { id: 2, name: "Second item", createdAt: "2026-02-20T14:30:00Z" },
];

function logic(req: express.Request, res: express.Response, _next: express.NextFunction) {
  if (!req.body?.name) {
    return res.status(400).json({ message: "name is required" });
  }

  const newItem: Item = {
    id: mockItems.length + 1,
    name: req.body.name,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({ item: newItem, existing: mockItems });
}

export const itemsRouter = router;
