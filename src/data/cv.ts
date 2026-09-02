export type Lang = 'en' | 'vi';
export type LangStr = { en: string; vi: string };

export const personalInfo = {
  name: "Lê Minh Nhật",
  title: { en: "Web/App Developer", vi: "Lập trình viên Web/App" } as LangStr,
  phone: "0707 193 002",
  email: "lnhat1938@gmail.com",
  facebook: "https://www.facebook.com/le.nhat.492484",
  youtube: "https://www.youtube.com/@NhatLe-bf7ez/videos",
  github: "minhnhatdepzai",
  githubLink: "https://github.com/minhnhatdepzai",
  profile: {
    en: "An enthusiastic IT candidate with 3 months of probationary product-development experience and 4 months of internship experience as a Business Analyst. I build practical Web, Mobile and AI-powered learning experiences, and I am always willing to learn, adapt and improve in a professional environment.",
    vi: "Một ứng viên CNTT nhiệt huyết với 3 tháng kinh nghiệm thử việc phát triển sản phẩm và 4 tháng thực tập ở vị trí Business Analyst. Tôi tập trung xây dựng các trải nghiệm Web, Mobile và sản phẩm học tập ứng dụng AI có tính thực tiễn, đồng thời luôn sẵn lòng học hỏi, thích nghi và phát triển trong môi trường chuyên nghiệp."
  } as LangStr
};

export const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "Figma",
  "Power BI",
  "React Native",
  "C/C++",
  "Python",
  "Node.js",
  "FlaskAPI/Flask",
  "Java (Swing)",
  "Git/Github",
  "Linux (Ubuntu)"
];

export const experience = [
  {
    company: "Công ty TNHH Công nghệ Giáo dục STEM",
    role: { en: "PROBATIONARY DEVELOPER", vi: "LẬP TRÌNH VIÊN THỬ VIỆC" } as LangStr,
    period: { en: "MAY 2026 - AUGUST 2026 · 3 MONTHS", vi: "THÁNG 5/2026 - THÁNG 8/2026 · 3 THÁNG" } as LangStr,
    responsibilities: [
      {
        en: "Developed Math Lab, an interactive learning product designed to make mathematical concepts easier to explore and understand",
        vi: "Phát triển Math Lab, sản phẩm học tập tương tác giúp người học khám phá và hiểu các khái niệm toán học trực quan hơn"
      },
      {
        en: "Built digital Chemistry Lab experiences supporting interactive science learning and experimentation",
        vi: "Xây dựng trải nghiệm Phòng thí nghiệm Hóa học số, hỗ trợ học tập và thực hành khoa học theo hướng tương tác"
      },
      {
        en: "Implemented the frontend website for the Smart Classroom product, focusing on clear interfaces and responsive use across devices",
        vi: "Phát triển website frontend cho sản phẩm Phòng học thông minh, tập trung vào giao diện rõ ràng và khả năng hiển thị tốt trên nhiều thiết bị"
      }
    ]
  },
  {
    company: "Mesh - Smart Workplace",
    role: { en: "BUSINESS ANALYST", vi: "CHUYÊN VIÊN PHÂN TÍCH NGHIỆP VỤ" } as LangStr,
    period: { en: "MARCH 2023 - JULY 2023", vi: "THÁNG 3/2023 - THÁNG 7/2023" } as LangStr,
    responsibilities: [
      { en: "Supported requirement gathering and analysis from clients and stakeholders", vi: "Hỗ trợ thu thập và phân tích yêu cầu từ khách hàng và các bên liên quan" },
      { en: "Assisted in documenting business requirements, workflows, and functional specifications", vi: "Hỗ trợ soạn thảo tài liệu yêu cầu nghiệp vụ, quy trình làm việc và đặc tả chức năng" },
      { en: "Used Power BI to create reports and dashboards for data visualization and analysis", vi: "Sử dụng Power BI để tạo báo cáo và dashboards phục vụ việc phân tích và trực quan hóa dữ liệu" },
      { en: "Supported communication between business teams and development teams to ensure clear understanding of requirements", vi: "Hỗ trợ trao đổi thông tin giữa nhóm nghiệp vụ và nhóm phát triển để đảm bảo quá trình hiểu rõ yêu cầu" },
      { en: "Analyzed customer needs and collaborated with team members to propose suitable solutions", vi: "Phân tích nhu cầu khách hàng và phối hợp cùng các thành viên trong nhóm để đề xuất giải pháp phù hợp" }
    ]
  }
];

export const education = [
  {
    school: { en: "UNIVERSITY INFORMATION OF TECHNOLOGY", vi: "ĐẠI HỌC CÔNG NGHỆ THÔNG TIN" } as LangStr,
    period: "2020 - 2023",
    degree: { en: "Computer Science", vi: "Khoa học Máy tính" } as LangStr
  },
  {
    school: { en: "FPT POLYTECHNIC", vi: "CAO ĐẲNG FPT POLYTECHNIC" } as LangStr,
    period: "2024 - 2026",
    degree: { en: "Mobile Developer", vi: "Lập trình viên Di động" } as LangStr
  }
];

export const initiatives = [
  {
    title: {
      en: "Vibe Coding for Learning Tutor",
      vi: "Tutor Vibe Coding trong học tập"
    } as LangStr,
    role: {
      en: "Self-organized learning initiative",
      vi: "Sáng kiến học tập tự tổ chức"
    } as LangStr,
    description: {
      en: "Designed and facilitated a tutoring session on using Vibe Coding for ideation, rapid prototyping and critical review in learning workflows.",
      vi: "Tự xây dựng nội dung và tổ chức buổi tutor về cách ứng dụng Vibe Coding vào lên ý tưởng, tạo prototype nhanh và phản biện kết quả trong quá trình học tập."
    } as LangStr,
    topics: ["Vibe Coding", "AI-assisted Learning", "Prototyping"]
  },
  {
    title: {
      en: "Information Security Seminar",
      vi: "Seminar An toàn thông tin"
    } as LangStr,
    role: {
      en: "Self-researched and organized seminar",
      vi: "Seminar tự nghiên cứu và tổ chức"
    } as LangStr,
    description: {
      en: "Researched, prepared and delivered a seminar on Broken Authentication, Linux foundations and defensive security practices.",
      vi: "Tự nghiên cứu, chuẩn bị nội dung và tổ chức seminar về Broken Authentication, nền tảng Linux và các nguyên tắc phòng vệ an toàn thông tin."
    } as LangStr,
    topics: ["Broken Authentication", "Linux", "Cybersecurity"]
  }
];

export const projects = [
  {
    category: { en: "SCHOOL PROJECT", vi: "DỰ ÁN MÔN HỌC" } as LangStr,
    items: [
      {
        name: { en: "Security", vi: "An Toàn Thông Tin" } as LangStr,
        desc: { en: "Analysis and demo of the Broken Authentication theme.", vi: "Phân tích và demo chủ đề Broken Authentication (Lỗ hổng xác thực)." } as LangStr,
        tags: ["Cybersecurity", "Authentication"],
        links: [{ label: "GitHub", url: "https://github.com/minhnhatdepzai/Broken_Authentication" }]
      },
      {
        name: { en: "Basic Machine Learning", vi: "Học Máy Cơ Bản" } as LangStr,
        desc: { en: "Face detection and analyst. Face mask detection and analyst.", vi: "Phát hiện và phân tích khuôn mặt. Phát hiện và phân tích việc đeo khẩu trang." } as LangStr,
        tags: ["AI/ML", "Python", "Computer Vision"],
        links: [
          { label: "Face detective", url: "https://github.com/minhnhatdepzai/Face_detective" },
          { label: "Face mask", url: "https://github.com/minhnhatdepzai/Face_mask" }
        ]
      },
      {
        name: { en: "Game Drive Car (Python)", vi: "Game Lái Xe (Python)" } as LangStr,
        desc: { en: "A basic driving car game built with Pygame.", vi: "Một game lái xe cơ bản được xây dựng bằng Python và Pygame." } as LangStr,
        tags: ["Python", "Game Development"],
        links: [{ label: "GitHub", url: "https://github.com/minhnhatdepzai/Basic_Python_Pygame_library" }],
        demos: [{ label: "Demo Video", url: "https://youtu.be/CLGiz2oexEI" }]
      },
      {
        name: { en: "Pronunciation Checker (Python 2)", vi: "Công cụ Kiểm tra Phát âm (Python 2)" } as LangStr,
        desc: { en: "Create the pronunciation checker with python.", vi: "Tạo công cụ kiểm tra phát âm bằng Python." } as LangStr,
        tags: ["Python", "AI/ML"],
        demos: [{ label: "Demo Video", url: "https://youtu.be/IFrT54nVSS8" }]
      },
      {
        name: { en: "Dental Clinic System", vi: "Hệ thống Phòng Khám Nha Khoa" } as LangStr,
        desc: { en: "Web (FE: html, css, js | BE: FlaskAPI | DB: MongoDB) and Mobile App (FE: java | BE: Node.js | DB: MongoDB).", vi: "Website (FE: html, css, js | BE: FlaskAPI | DB: MongoDB) và Ứng dụng di động (FE: Java | BE: Node.js | DB: MongoDB)." } as LangStr,
        tags: ["Web Development", "Mobile App", "JavaScript", "Java", "Python"],
        links: [
          { label: "Web Repo", url: "https://github.com/minhnhatdepzai/nhakhoane" },
          { label: "App Repo", url: "https://github.com/MinhNhatdayne/NhaKhoa" }
        ],
        demos: [{ label: "Web Demo", url: "https://minhnhatdayne.github.io/NhaKhoa/index.html" }]
      }
    ]
  },
  {
    category: { en: "PERSONAL PROJECT", vi: "DỰ ÁN CÁ NHÂN" } as LangStr,
    items: [
      {
        name: { en: "Computer Vision with CNNs, YoloV", vi: "Thị giác máy tính với CNNs, YoloV" } as LangStr,
        desc: { en: "Waste identification, Fire detection, and Count the vehicles passing by.", vi: "Bao gồm Nhận diện rác thải, Phát hiện hỏa hoạn, và Đếm xe đi ngang qua." } as LangStr,
        tags: ["AI/ML", "Computer Vision", "Python"],
        links: [{ label: "Count Vehicles Repo", url: "https://github.com/minhnhatdepzai/Count_vehicles" }],
        demos: [
          { label: "Waste ID Demo", url: "https://youtu.be/IFrT54nVSS8" },
          { label: "Fire Demo", url: "https://youtu.be/Shd0Y6b93r4" }
        ]
      },
      {
        name: { en: "Simple Web Applications", vi: "Các Ứng Dụng Web/App Đơn Giản" } as LangStr,
        desc: { en: "Shop Web, Calculator, Web learning AI, and Photo editing App.", vi: "Web bán hàng, Máy tính, Web học AI, và Ứng dụng/Web chỉnh sửa ảnh." } as LangStr,
        tags: ["Web Development", "Mobile App", "React Native", "JavaScript"],
        links: [
          { label: "Shop Web", url: "https://github.com/minhnhatdepzai/shopbanhang" },
          { label: "Calculator", url: "https://github.com/minhnhatdepzai/caculator" },
          { label: "Web AI", url: "https://github.com/minhnhatdepzai/AI-quanh-ta" },
          { label: "Photo App", url: "https://github.com/minhnhatdepzai/thivietmy" }
        ]
      }
    ]
  },
  {
    category: { en: "SEMINARS & TUTORING", vi: "THAM GIA HỘI THẢO & GIA SƯ" } as LangStr,
    items: [
      {
        name: { en: "Security & AI Workshops", vi: "Các Buổi Workshop Về Bảo Mật & AI" } as LangStr,
        desc: { en: "Introduced and guided students in Phishing Attacks, Programming with AI, Password Cracking, Ransomware, fake websites with Kali Linux, and DoS attacks.", vi: "Giới thiệu và hướng dẫn sinh viên về: Tấn công Phishing, Lập trình AI, Bẻ khóa mật khẩu, Ransomware, tạo web giả mạo với Kali Linux và Tấn công DoS." } as LangStr,
        tags: ["Cybersecurity", "AI/ML", "Linux"],
        links: [
          { label: "Password Cracking Repo", url: "https://github.com/MinhNhatdayne/nhatnhapmk" },
          { label: "Ransomware Repo", url: "https://github.com/MinhNhatdayne/Ransomeware_test" },
          { label: "Phishing Seminar", url: "https://www.facebook.com/share/p/1AFrzzHZ.5m/" },
          { label: "AI Tutor Post", url: "https://www.facebook.com/share/p/1B7zthh3KC/" }
        ]
      }
    ]
  }
];

export const prizes = [
  { en: "Identity Award in the Bản địa Khởi sinh competition.", vi: "Giải Bản sắc — Cuộc thi Bản địa Khởi sinh." } as LangStr,
  { en: "First Prize in the Poly Web Game Championship.", vi: "Giải Nhất — Cuộc thi Poly Web Game Championship." } as LangStr,
  { en: "Top 8 in the Poly Coder Web Design Hackathon.", vi: "Top 8 — Cuộc thi Hackathon Web Design Poly Coder." } as LangStr,
  { en: "Second prize in the FPT Polytechnic Language School competition.", vi: "Giải Nhì cuộc thi Trường Ngoại ngữ FPT Polytechnic." } as LangStr,
  { en: "Impressive award in The Lead's Face competition, FPT Polytechnic Soft Skills Club.", vi: "Giải Ấn tượng cuộc thi Gương mặt Thủ lĩnh, CLB Kỹ năng mềm FPT Polytechnic." } as LangStr,
  { en: "Top 5 in the FPT Polytechnic UI-UX competition.", vi: "Top 5 chung cuộc - Cuộc thi UI-UX FPT Polytechnic." } as LangStr,
  { en: "Ranked in the top 8 in the Viet My College Vibe Coding competition.", vi: "Top 8 chung cuộc - Cuộc thi Vibe Coding Cao đẳng Việt Mỹ." } as LangStr,
  { en: "Semifinals of the EVC competition at UEF University of Economics and Finance.", vi: "Tiến vào Bán kết cuộc thi EVC tại Đại học Kinh tế Tài chính (UEF)." } as LangStr,
  { en: "Third prize in the Poly Coder Club chatbot design competition.", vi: "Giải Ba cuộc thi Thiết kế Chatbot - CLB Poly Coder." } as LangStr
];
