import monitor from "../../models/monitor.model.js";
import checkResult from "../../models/checkResult.model.js";

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

export const getMonitorLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await checkResult.find({
      monitorId: id
    })
      .sort({ checkedAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

export const getMonitorStats = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await checkResult.find({
      monitorId: id
    });

    const total = results.length;
    const upCount = results.filter(r => r.status === "UP").length;

    const avgResponseTime =
      results.reduce((sum, r) => sum + (r.responseTime || 0), 0) /
      (total || 1);

    const uptime = total
      ? ((upCount / total) * 100).toFixed(2)
      : 0;

    res.json({
      totalChecks: total,
      upChecks: upCount,
      downChecks: total - upCount,
      uptimePercentage: uptime,
      averageResponseTime: Math.round(avgResponseTime)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

export const getUptimeBars = async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days || "90");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await checkResult.find({
      monitorId: id,
      checkedAt: { $gte: startDate }
    }).sort({ checkedAt: 1 });

    const dayMap = {};

    for (const result of results) {
      const dateKey = result.checkedAt
        .toISOString()
        .split("T")[0];

      if (!dayMap[dateKey]) {
        dayMap[dateKey] = {
          hasDown: false
        };
      }

      if (result.status === "DOWN") {
        dayMap[dateKey].hasDown = true;
      }
    }

    const bars = Object.keys(dayMap).map(date => ({
      date,
      status: dayMap[date].hasDown ? "DOWN" : "UP"
    }));

    res.json(bars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate uptime bars" });
  }
};

const calculateUptime = async (monitorId, hours) => {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const results = await checkResult.find({
    monitorId,
    checkedAt: { $gte: since }
  });

  if (results.length === 0) return 100;

  const upCount = results.filter(r => r.status === "UP").length;

  return Number(((upCount / results.length) * 100).toFixed(3));
};

export const getUptimeSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = {
      last24h: await calculateUptime(id, 24),
      last7d: await calculateUptime(id, 24 * 7),
      last30d: await calculateUptime(id, 24 * 30),
      last90d: await calculateUptime(id, 24 * 90)
    };

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate uptime summary" });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const { id } = req.params;

    const results = await checkResult.find({
      monitorId: id
    }).sort({ checkedAt: 1 });

    const incidents = [];
    let currentIncident = null;

    for (const r of results) {
      if (r.status === "DOWN") {
        if (!currentIncident) {
          currentIncident = {
            startedAt: r.checkedAt,
            endedAt: r.checkedAt,
            statusCode: r.statusCode,
            error: r.error
          };
        } else {
          currentIncident.endedAt = r.checkedAt;
        }
      } else {
        if (currentIncident) {
          const durationMs =
            new Date(currentIncident.endedAt) -
            new Date(currentIncident.startedAt);

          incidents.push({
            ...currentIncident,
            durationMinutes: Math.ceil(durationMs / 60000)
          });

          currentIncident = null;
        }
      }
    }

    if (currentIncident) {
      const durationMs =
        new Date(currentIncident.endedAt) -
        new Date(currentIncident.startedAt);

      incidents.push({
        ...currentIncident,
        durationMinutes: Math.ceil(durationMs / 60000)
      });
    }

    res.json(incidents.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
};