const getDashboard = async (req, res) => {
  try {
    const user = req.user;

    let dashboardData;

    switch (user.role) {
      case "super_admin":
        dashboardData = {
          role: "super_admin",
          title: "Super Admin Dashboard",
          stats: {
            schools: 0,
            admins: 0,
          },
        };
        break;

      case "admin":
        dashboardData = {
          role: "admin",
          title: "Admin Dashboard",
          stats: {
            students: 0,
            teachers: 0,
          },
        };
        break;

      case "teacher":
        dashboardData = {
          role: "teacher",
          title: "Teacher Dashboard",
          stats: {
            classes: 0,
            courses: 0,
          },
        };
        break;

      case "student":
        dashboardData = {
          role: "student",
          title: "Student Dashboard",
          stats: {
            courses: 0,
            assignments: 0,
          },
        };
        break;

      default:
        return res.status(403).json({
          success: false,
          message: "Invalid role",
        });
    }

    res.status(200).json({
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getDashboard,
};