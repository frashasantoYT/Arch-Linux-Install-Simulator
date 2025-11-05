# 🐧 Arch Linux Installation Simulator

<div align="center">

![Arch Linux](https://archlinux.org/static/logos/archlinux-logo-dark-90dpi.ebdee92a15b3.png)

**An Interactive, Educational Platform for Mastering Arch Linux Installation**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](https://frashasantoyt.github.io/Arch-Linux-Install-Simulator/) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

The **Arch Linux Installation Simulator** is a comprehensive, browser-based learning tool designed to teach users how to install Arch Linux from scratch in a safe, simulated environment. Perfect for beginners who want to understand the installation process before attempting it on real hardware, and for enthusiasts looking to review the steps.

### 🎯 Why This Project?

Installing Arch Linux is often considered challenging for newcomers due to its manual, hands-on approach. This simulator provides:

- **Zero Risk**: Practice without fear of breaking your system
- **Step-by-Step Guidance**: Detailed explanations for each installation phase
- **Real-World Scenarios**: Supports WiFi setup, UEFI/GPT, and Legacy BIOS/MBR installations
- **Interactive Learning**: Type commands, make choices, and see realistic terminal output
- **Educational Focus**: Deep-dive explanations of WHY each step matters

---

## ✨ Features

### 🖥️ **Comprehensive Installation Coverage**

- ✅ **Network Configuration**
  - Ethernet (automatic)
  - WiFi setup with `iwctl`
  - Internet connectivity testing

- ✅ **Boot Mode Selection**
  - UEFI/GPT (modern systems)
  - Legacy BIOS/MBR (older systems)
  - Automatic verification

- ✅ **Disk Partitioning**
  - GPT partitioning with `gdisk` (UEFI)
  - MBR partitioning with `fdisk` (BIOS)
  - EFI System Partition setup
  - Swap and root partition creation

- ✅ **System Installation**
  - Base system installation with `pacstrap`
  - Filesystem formatting (FAT32, ext4, swap)
  - Partition mounting and fstab generation
  - System configuration (timezone, locale, hostname)
  - User account creation and sudo setup

- ✅ **Bootloader Installation**
  - GRUB for UEFI systems
  - GRUB for Legacy BIOS systems
  - Boot configuration generation

### 🎨 **User Experience**

- **Authentic Terminal Interface**: Realistic Arch Linux terminal with syntax highlighting
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark Theme**: Professional Arch Linux-inspired color scheme
- **Interactive Commands**: Type commands yourself or use auto-fill
- **Visual Progress**: Step-by-step progress tracking with indicators
- **Educational Explanations**: Each step includes detailed technical explanations

### 🛠️ **Technical Features**

- Pure HTML5, CSS3, and Vanilla JavaScript
- No backend required - runs entirely in browser
- Tailwind CSS for modern, responsive design
- JetBrains Mono font for authentic terminal feel
- Path-based navigation (adapts based on user choices)
- Local storage for progress tracking (optional)

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/arch-linux-simulator.git
   cd arch-linux-simulator
   ```

2. **Open the simulator**
   ```bash
   # Simply open the HTML file in your browser
   open arch-linux-simulator.html
   # or on Windows
   start arch-linux-simulator.html
   # or on Linux
   xdg-open arch-linux-simulator.html
   ```

3. **Start learning!**
   - Click "🚀 Start Installation"
   - Follow the step-by-step instructions
   - Type commands or use auto-fill
   - Read the detailed explanations

---

## 📚 Documentation

### Installation Steps Covered

| Step | Description | Type |
|------|-------------|------|
| 1️⃣ | Verify Boot Mode (UEFI/BIOS) | Command |
| 2️⃣ | Check Network Interfaces | Command |
| 3️⃣ | Choose Connection Type | Choice |
| 4️⃣ | Connect to WiFi (if selected) | Command |
| 5️⃣ | Test Internet Connection | Command |
| 6️⃣ | Update System Clock | Command |
| 7️⃣ | Choose Boot Mode (UEFI/BIOS) | Choice |
| 8️⃣ | Disk Partitioning (GPT/MBR) | Command |
| 9️⃣ | Format Partitions | Command |
| 🔟 | Mount Partitions | Command |
| 1️⃣1️⃣ | Install Base System | Command |
| 1️⃣2️⃣ | Generate Fstab | Command |
| 1️⃣3️⃣ | Configure System | Command |
| 1️⃣4️⃣ | Install Bootloader | Command |

### How It Works

The simulator uses a **state-machine approach** to guide users through the installation:

```javascript
// Path-based navigation
User Choice → Network (Ethernet/WiFi)
            → Boot Mode (UEFI/BIOS)
            → Adaptive steps based on selections
```

Each step includes:
- **Description**: What you're about to do
- **Explanation**: Why it matters and how it works
- **Command**: The exact command to type
- **Output**: Realistic terminal output
- **Hints**: Quick tips for understanding

---

## 🎓 Educational Value

### What You'll Learn

- **Linux Fundamentals**: Understanding boot processes, filesystems, and partitioning
- **Command Line Skills**: Practice with real Linux commands
- **System Architecture**: UEFI vs BIOS, GPT vs MBR, boot chains
- **Network Configuration**: WiFi setup, DNS resolution, network interfaces
- **Security Basics**: User accounts, sudo privileges, password management
- **Best Practices**: Why each step is necessary in the installation process

### Target Audience

- 🎓 **Beginners**: New to Linux or Arch Linux
- 💻 **Students**: Learning system administration
- 🔧 **Enthusiasts**: Want to understand Arch installation deeply
- 👨‍🏫 **Educators**: Teaching Linux concepts
- 🔄 **Returners**: Refreshing knowledge before a real installation

---

## 🛣️ Roadmap

### Current Version (v1.0)
- ✅ Complete installation simulation
- ✅ WiFi and Ethernet support
- ✅ UEFI and BIOS paths
- ✅ Detailed explanations
- ✅ Responsive design

### Planned Features (v2.0)
- [ ] Desktop Environment selection (GNOME, KDE, XFCE, i3)
- [ ] Package manager tutorial
- [ ] AUR helper setup
- [ ] Post-installation configuration
- [ ] Save/load progress
- [ ] Multiple language support
- [ ] Accessibility improvements
- [ ] Dark/Light theme toggle

### Future Ideas
- [ ] LVM setup
- [ ] LUKS encryption
- [ ] RAID configuration
- [ ] Advanced networking (VPN, bridges)
- [ ] Troubleshooting scenarios
- [ ] Quiz mode to test knowledge

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the problem
2. **Suggest Features**: Share your ideas for improvements
3. **Submit Pull Requests**: Fix bugs or add features
4. **Improve Documentation**: Help make the guide clearer
5. **Spread the Word**: Share with others learning Arch Linux

### Development Setup

```bash
# Fork the repository
git clone https://github.com/yourusername/arch-linux-simulator.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Test thoroughly in multiple browsers

# Commit your changes
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Attribution

- **Arch Linux** logo and branding are trademarks of [Arch Linux](https://archlinux.org/)
- This project is **not affiliated** with the official Arch Linux project
- Created for educational purposes only

---

## 🔗 Resources

### Official Arch Linux Resources
- [Arch Linux Official Website](https://archlinux.org/)
- [Arch Wiki - Installation Guide](https://wiki.archlinux.org/title/Installation_guide)
- [Download Arch Linux ISO](https://archlinux.org/download/)
- [Arch Linux Forums](https://bbs.archlinux.org/)
- [Arch Linux Subreddit](https://www.reddit.com/r/archlinux/)

### Related Projects
- [archinstall](https://github.com/archlinux/archinstall) - Official Arch installer
- [ArchLabs](https://archlabslinux.com/) - Arch-based distribution
- [EndeavourOS](https://endeavouros.com/) - User-friendly Arch-based distro

---

## 🌟 Acknowledgments

Special thanks to:
- The **Arch Linux community** for comprehensive documentation
- **Tailwind CSS** for the beautiful utility framework
- **JetBrains** for the JetBrains Mono font
- All contributors and users providing feedback

---

## 📬 Contact

- **Creator**: [King Santo]
- **Portfolio**: [https://santoiservices.com]
- **GitHub**: [@yourusername](https://github.com/frashasantoYT)
- **Email**: frashasanto111@gmail.com


---

<div align="center">

**Made with ❤️ for the Arch Linux community**

_"I use Arch, btw" - Now you can too!_ 😎

[⬆ Back to Top](#-arch-linux-installation-simulator)

</div>
