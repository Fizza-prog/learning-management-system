export const dashboardConfig = {
  super_admin: {
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
      },
      {
        label: "Schools",
        path: "/schools",
        icon: "schools",
      },
      {
        label: "Admins",
        path: "/admins",
        icon: "admins",
      },
      {
        label: "Subscriptions",
        path: "/subscriptions",
        icon: "subscriptions",
      },
      {
        label: "System Settings",
        path: "/settings",
        icon: "settings",
      },
    ],

    stats: [
      {
        title: "Total Schools",
        value: "150",
      },
      {
        title: "Total Users",
        value: "15000",
      },
    ],

    activities: [
      "New school registered",
      "Admin account created",
      "Subscription updated",
    ],
  },

  admin: {
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
      },
      {
        label: "Students",
        path: "/students",
        icon: "students",
      },
      {
        label: "Teachers",
        path: "/teachers",
        icon: "teachers",
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: "attendance",
      },
      {
        label: "Fees",
        path: "/fees",
        icon: "fees",
      },
      {
        label: "Timetable",
        path: "/timetable",
        icon: "timetable",
      },
      {
        label: "Grades",
        path: "/grades",
        icon: "grades",
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: "announcements",
      },
    ],

    stats: [
      {
        title: "Total Students",
        value: "1200",
      },
      {
        title: "Total Teachers",
        value: "85",
      },
      {
        title: "Attendance",
        value: "92%",
      },
      {
        title: "Pending Fees",
        value: "$25,000",
      },
    ],

    activities: [
      "New student added",
      "Teacher assigned to class",
      "Fee report generated",
    ],
  },

  teacher: {
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
      },
      {
        label: "My Classes",
        path: "/classes",
        icon: "classes",
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: "attendance",
      },
      {
        label: "Grades",
        path: "/grades",
        icon: "grades",
      },
      {
        label: "Announcements",
        path: "/announcements",
        icon: "announcements",
      },
    ],

    stats: [
      {
        title: "My Classes",
        value: "5",
      },
      {
        title: "Students",
        value: "180",
      },
    ],

    activities: [
      "Attendance marked",
      "Grades updated",
      "Assignment uploaded",
    ],
  },

  students: {
    menu: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: "dashboard",
      },
      {
        label: "My Courses",
        path: "/courses",
        icon: "courses",
      },
      {
        label: "Timetable",
        path: "/timetable",
        icon: "timetable",
      },
      {
        label: "Grades",
        path: "/grades",
        icon: "grades",
      },
      {
        label: "Fees",
        path: "/fees",
        icon: "fees",
      },
    ],

    stats: [
      {
        title: "Attendance",
        value: "95%",
        icon: "attendance",
      },
      {
        title: "GPA",
        value: "3.8",
        icon: "grade",
      },
    ],

    activities: [
      "New assignment received",
      "Result published",
      "Timetable updated",
    ],
  },
};