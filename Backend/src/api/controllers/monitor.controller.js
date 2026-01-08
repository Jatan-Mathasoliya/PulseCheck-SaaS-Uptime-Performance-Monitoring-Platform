import monitor from "../../models/monitor.model.js";

export const createMonitor = async (req, res) => {
  try {
    const { url, interval } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const newMonitor = await monitor.create({
      userId: req.user.userId,
      url,
      interval: interval || 3600,
      nextCheckAt: new Date(Date.now() + (interval || 3600) * 1000)
    });

    res.status(201).json(newMonitor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create monitor" });
  }
};

export const getMonitors = async (req, res) => {
  try {
    const allMonitors = await monitor.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(allMonitors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch monitors" });
  }
};
