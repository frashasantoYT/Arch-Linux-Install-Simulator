# 🐧 Arch Linux Installation Guide - Pro Edition

> **Complete step-by-step guide to installing Arch Linux from scratch**  
> Last Updated: November 2025

## 📋 Table of Contents

1. [Pre-Installation](#pre-installation)
2. [Boot & Initial Setup](#boot--initial-setup)
3. [Disk Partitioning](#disk-partitioning)
4. [Format & Mount Partitions](#format--mount-partitions)
5. [Install Base System](#install-base-system)
6. [System Configuration](#system-configuration)
7. [Bootloader Setup](#bootloader-setup)
8. [Post-Installation](#post-installation)
9. [Desktop Environment](#desktop-environment)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Pre-Installation

### What You'll Need

- **USB Drive** (4GB minimum)
- **Internet Connection** (Ethernet recommended)
- **Backup** of important data
- **Time** (1-2 hours for basic install)

### Download Arch Linux ISO

```bash
# Visit: https://archlinux.org/download/
# Download the latest ISO (approximately 800MB)
# Verify the signature for security
```

### Create Bootable USB

#### On Windows:
```powershell
# Use Rufus (https://rufus.ie/)
# 1. Select your USB drive
# 2. Select Arch ISO
# 3. Partition scheme: GPT
# 4. Target system: UEFI
# 5. Click START
```

#### On Linux:
```bash
# Find your USB device
lsblk

# Write ISO to USB (replace sdX with your device)
sudo dd if=archlinux-*.iso of=/dev/sdX bs=4M status=progress && sync
```

### BIOS Settings

1. **Restart** and enter BIOS/UEFI (usually F2, F12, DEL, or ESC)
2. **Disable Secure Boot** (temporarily)
3. **Enable UEFI mode** (not Legacy/CSM)
4. **Set USB as first boot device**
5. **Save and Exit**

---

## 🚀 Boot & Initial Setup

### Step 1: Boot from USB

```
- Plug in USB drive
- Restart computer
- Select USB drive from boot menu
- Choose "Arch Linux install medium"
```

**Expected Result:** You'll see a black screen with white text and eventually a prompt:
```
root@archiso ~ #
```

### Step 2: Verify Boot Mode

```bash
# Check if booted in UEFI mode
ls /sys/firmware/efi/efivars
```

**✅ Success:** Directory exists and shows files  
**❌ If not:** You're in BIOS mode (older system or wrong settings)

### Step 3: Set Keyboard Layout (Optional)

```bash
# List available layouts
ls /usr/share/kbd/keymaps/**/*.map.gz

# Load layout (example: German)
loadkeys de-latin1

# Default is US layout - skip if that works for you
```

### Step 4: Verify Internet Connection

```bash
# Check if connected
ping -c 3 archlinux.org

# If using WiFi, connect with iwctl
iwctl

# Inside iwctl:
device list                    # See your WiFi device (usually wlan0)
station wlan0 scan            # Scan for networks
station wlan0 get-networks    # List networks
station wlan0 connect "SSID"  # Connect (replace SSID)
exit

# Test again
ping -c 3 archlinux.org
```

**🔴 No Internet?**
- Use Ethernet cable (easiest)
- Check WiFi credentials
- Ensure router is working

### Step 5: Update System Clock

```bash
# Enable NTP (Network Time Protocol)
timedatectl set-ntp true

# Verify
timedatectl status
```

**Why?** Accurate time prevents SSL certificate errors during package installation.

---

## 💾 Disk Partitioning

### Step 1: Identify Your Disk

```bash
# List all disks
lsblk

# Or use fdisk
fdisk -l
```

**Output Example:**
```
NAME   SIZE   TYPE
sda    500G   disk    <- Your main drive
├─sda1  512M  part    <- May have existing partitions
└─sda2  499G  part
```

**⚠️ CRITICAL:** Note your disk name (usually `/dev/sda`, `/dev/nvme0n1`, etc.)  
**EVERYTHING ON THIS DISK WILL BE ERASED!**

### Step 2: Partition the Disk

We'll use `gdisk` for GPT (UEFI) partitioning:

```bash
# Start gdisk (replace sda with your disk)
gdisk /dev/sda
```

#### Inside gdisk:

```bash
# Press 'o' to create new GPT partition table
o
# Press 'y' to confirm

# Create EFI System Partition (ESP)
n                      # New partition
1                      # Partition number 1
[Enter]               # First sector (default)
+512M                 # Last sector (512MB for EFI)
ef00                  # EFI System type

# Create Swap Partition (Optional but recommended)
n                      # New partition
2                      # Partition number 2
[Enter]               # First sector (default)
+4G                   # 4GB swap (adjust based on RAM)
8200                  # Linux swap type

# Create Root Partition
n                      # New partition
3                      # Partition number 3
[Enter]               # First sector (default)
[Enter]               # Last sector (use remaining space)
8300                  # Linux filesystem type (default)

# Review your partitions
p

# Write changes and exit
w                      # Write
y                      # Confirm
```

### Partitioning Scheme Explained

| Partition | Size | Type | Mount Point | Purpose |
|-----------|------|------|-------------|---------|
| `/dev/sda1` | 512MB | EFI | `/boot` | Boot files (UEFI) |
| `/dev/sda2` | 4GB | Swap | N/A | Virtual memory |
| `/dev/sda3` | Remaining | ext4 | `/` | Root filesystem |

**Alternative: Separate Home Partition**
```bash
# After creating root partition with smaller size:
n
4
[Enter]
[Enter]
8300
# Mount at /home later
```

**Swap Size Recommendations:**
- **2GB RAM:** 4GB swap
- **4GB RAM:** 4GB swap
- **8GB+ RAM:** 2-4GB swap (or none if you don't hibernate)
- **For hibernation:** Swap = RAM size

### Verify Partitions

```bash
# Check your work
lsblk
```

Expected output:
```
NAME   SIZE   TYPE
sda    500G   disk
├─sda1  512M  part
├─sda2    4G  part
└─sda3  495G  part
```

---

## 🔧 Format & Mount Partitions

### Step 1: Format Partitions

```bash
# Format EFI partition as FAT32
mkfs.fat -F32 /dev/sda1

# Format root partition as ext4
mkfs.ext4 /dev/sda3

# Setup swap partition
mkswap /dev/sda2
swapon /dev/sda2
```

**Output for each:**
```
✓ Created filesystem on /dev/sdaX
```

**Filesystem Options:**
- **ext4** - Default, reliable, widely supported
- **btrfs** - Modern, snapshots, compression (advanced)
- **xfs** - High performance, large files

### Step 2: Mount Filesystems

```bash
# Mount root partition to /mnt
mount /dev/sda3 /mnt

# Create EFI mount point
mkdir -p /mnt/boot

# Mount EFI partition
mount /dev/sda1 /mnt/boot

# If you created a separate /home partition:
# mkdir /mnt/home
# mount /dev/sda4 /mnt/home
```

### Verify Mounts

```bash
lsblk -f
```

You should see:
```
NAME   FSTYPE MOUNTPOINT
sda1   vfat   /mnt/boot
sda2   swap   [SWAP]
sda3   ext4   /mnt
```

---

## 📦 Install Base System

### Step 1: Select Mirror (Optional but Recommended)

```bash
# Backup original mirrorlist
cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup

# Edit mirrorlist
nano /etc/pacman.d/mirrorlist

# Move mirrors closest to you to the top
# Press Ctrl+K to cut a line, Ctrl+U to paste
# Ctrl+O to save, Ctrl+X to exit

# Or use reflector to auto-select fastest mirrors
reflector --country US --age 12 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

**Why?** Faster download speeds during installation.

### Step 2: Install Essential Packages

```bash
# Install base system
pacstrap /mnt base linux linux-firmware

# Wait 5-15 minutes depending on internet speed
```

**What's being installed:**
- **base** - Minimal Arch Linux system
- **linux** - Linux kernel
- **linux-firmware** - Hardware firmware files

### Step 3: Install Additional Essential Tools

```bash
# Install these now to avoid issues later
pacstrap /mnt base-devel nano vim git networkmanager grub efibootmgr
```

**Package Breakdown:**
- **base-devel** - Development tools (make, gcc, etc.)
- **nano/vim** - Text editors
- **git** - Version control
- **networkmanager** - Network management
- **grub** - Bootloader
- **efibootmgr** - UEFI boot manager

**Optional but useful:**
```bash
pacstrap /mnt intel-ucode      # For Intel CPUs
# OR
pacstrap /mnt amd-ucode        # For AMD CPUs
```

---

## ⚙️ System Configuration

### Step 1: Generate Fstab

```bash
# Generate filesystem table
genfstab -U /mnt >> /mnt/etc/fstab

# Verify it looks correct
cat /mnt/etc/fstab
```

**What is fstab?** Tells system which partitions to mount at boot.

### Step 2: Chroot into New System

```bash
# Change root into the new system
arch-chroot /mnt

# Your prompt changes to:
[root@archiso /]#
```

**You're now inside your new Arch installation!**

### Step 3: Set Timezone

```bash
# List available timezones
ls /usr/share/zoneinfo/

# Set timezone (example: New York)
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Generate /etc/adjtime
hwclock --systohc
```

**Popular timezones:**
- US East: `America/New_York`
- US West: `America/Los_Angeles`
- UK: `Europe/London`
- Central EU: `Europe/Paris`

### Step 4: Set Locale

```bash
# Edit locale.gen
nano /etc/locale.gen

# Uncomment your locale (remove # from the line):
# en_US.UTF-8 UTF-8

# Save and exit (Ctrl+O, Ctrl+X)

# Generate locales
locale-gen

# Set system locale
echo "LANG=en_US.UTF-8" > /etc/locale.conf

# If you changed keyboard layout earlier:
echo "KEYMAP=de-latin1" > /etc/vconsole.conf
```

### Step 5: Set Hostname

```bash
# Choose a name for your computer
echo "archlinux" > /etc/hostname

# Edit hosts file
nano /etc/hosts
```

Add these lines:
```
127.0.0.1    localhost
::1          localhost
127.0.1.1    archlinux.localdomain    archlinux
```

Replace `archlinux` with your chosen hostname.

### Step 6: Set Root Password

```bash
# Set password for root user
passwd

# Enter a strong password twice
# YOU WON'T SEE CHARACTERS AS YOU TYPE (this is normal)
```

**⚠️ CRITICAL:** Don't forget this password!

### Step 7: Create User Account

```bash
# Create your user (replace 'username' with desired name)
useradd -m -G wheel,audio,video,storage -s /bin/bash username

# Set password for user
passwd username

# Give user sudo privileges
EDITOR=nano visudo

# Uncomment this line (remove #):
%wheel ALL=(ALL:ALL) ALL

# Save and exit
```

**What happened:**
- Created user with home directory (`-m`)
- Added to important groups (`-G wheel,audio,video,storage`)
- Set bash as default shell
- Gave sudo access via wheel group

---

## 🥾 Bootloader Setup

### Install GRUB (UEFI)

```bash
# Install GRUB to EFI partition
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB

# Generate GRUB configuration
grub-mkconfig -o /boot/grub/grub.cfg
```

**Expected output:**
```
Installing for x86_64-efi platform.
Installation finished. No error reported.
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-linux
Found initrd image: /boot/initramfs-linux.img
done
```

### Enable Network Manager

```bash
# Enable NetworkManager to start at boot
systemctl enable NetworkManager
```

### Exit and Reboot

```bash
# Exit chroot environment
exit

# Unmount all partitions
umount -R /mnt

# Reboot
reboot
```

**Remove the USB drive when system restarts!**

---

## 🎉 Post-Installation

### First Boot

1. **Select Arch Linux from GRUB menu**
2. **Login as root or your user**
3. **Connect to internet:**

```bash
# If using WiFi
nmcli device wifi list
nmcli device wifi connect "SSID" password "password"

# Test connection
ping -c 3 archlinux.org
```

### Update System

```bash
# Update package database and system
sudo pacman -Syu
```

### Install Essential Software

```bash
# Install common utilities
sudo pacman -S \
  firefox \
  git \
  htop \
  neofetch \
  wget \
  curl \
  unzip \
  man-db \
  man-pages \
  which \
  tree
```

### Enable AUR (Arch User Repository)

```bash
# Install yay (AUR helper)
cd /tmp
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# Now you can install AUR packages with:
# yay -S package-name
```

---

## 🖥️ Desktop Environment

### Option 1: GNOME (Beginner-Friendly)

```bash
# Install GNOME desktop
sudo pacman -S gnome gnome-extra

# Enable display manager
sudo systemctl enable gdm

# Reboot to start GUI
reboot
```

### Option 2: KDE Plasma (Customizable)

```bash
# Install KDE Plasma
sudo pacman -S plasma kde-applications

# Enable display manager
sudo systemctl enable sddm

# Reboot
reboot
```

### Option 3: XFCE (Lightweight)

```bash
# Install XFCE
sudo pacman -S xfce4 xfce4-goodies lightdm lightdm-gtk-greeter

# Enable display manager
sudo systemctl enable lightdm

# Reboot
reboot
```

### Option 4: i3 (Tiling, Advanced)

```bash
# Install i3 and essentials
sudo pacman -S i3-wm i3status i3lock dmenu xorg-xinit xorg-server

# Create .xinitrc
echo "exec i3" > ~/.xinitrc

# Start X server
startx
```

### Graphics Drivers

```bash
# For Intel graphics
sudo pacman -S xf86-video-intel

# For AMD graphics
sudo pacman -S xf86-video-amdgpu

# For NVIDIA graphics (proprietary)
sudo pacman -S nvidia nvidia-utils

# For NVIDIA (open source)
sudo pacman -S xf86-video-nouveau
```

---

## 🔧 Essential Configuration

### Audio Setup

```bash
# Install PulseAudio
sudo pacman -S pulseaudio pulseaudio-alsa pavucontrol

# OR install PipeWire (modern alternative)
sudo pacman -S pipewire pipewire-pulse pipewire-alsa pavucontrol
```

### Bluetooth

```bash
# Install Bluetooth packages
sudo pacman -S bluez bluez-utils

# Enable Bluetooth service
sudo systemctl enable bluetooth
sudo systemctl start bluetooth
```

### Printing

```bash
# Install CUPS (printing system)
sudo pacman -S cups cups-pdf

# Enable CUPS
sudo systemctl enable cups
sudo systemctl start cups
```

### Enable SSD TRIM (if using SSD)

```bash
# Enable weekly TRIM
sudo systemctl enable fstrim.timer
```

### Enable Firewall

```bash
# Install UFW (Uncomplicated Firewall)
sudo pacman -S ufw

# Enable firewall
sudo ufw enable
sudo systemctl enable ufw

# Allow SSH if needed
sudo ufw allow ssh
```

---

## 🎨 Customization & Optimization

### Install Fonts

```bash
# Install common fonts
sudo pacman -S \
  ttf-dejavu \
  ttf-liberation \
  noto-fonts \
  noto-fonts-emoji \
  ttf-roboto \
  ttf-font-awesome
```

### Improve Performance

```bash
# Enable parallel downloads in pacman
sudo nano /etc/pacman.conf

# Uncomment:
ParallelDownloads = 5

# Enable multilib repository (32-bit support)
# Uncomment these lines:
[multilib]
Include = /etc/pacman.d/mirrorlist

# Update database
sudo pacman -Sy
```

### Useful Aliases

```bash
# Edit bash config
nano ~/.bashrc

# Add these aliases:
alias update='sudo pacman -Syu'
alias install='sudo pacman -S'
alias remove='sudo pacman -Rs'
alias search='pacman -Ss'
alias clean='sudo pacman -Sc'
alias ls='ls --color=auto'
alias ll='ls -lah'
alias grep='grep --color=auto'

# Reload config
source ~/.bashrc
```

---

## 🛠️ Troubleshooting

### No Internet After Reboot

```bash
# Check NetworkManager status
sudo systemctl status NetworkManager

# If not running:
sudo systemctl start NetworkManager
sudo systemctl enable NetworkManager

# Connect to WiFi
nmcli device wifi connect "SSID" password "password"
```

### Forgot Root Password

```bash
# Boot from USB again
# Mount partitions
mount /dev/sda3 /mnt
mount /dev/sda1 /mnt/boot

# Chroot
arch-chroot /mnt

# Reset password
passwd

# Exit and reboot
exit
reboot
```

### GRUB Not Showing

```bash
# Boot from USB
# Mount and chroot as above
arch-chroot /mnt

# Reinstall GRUB
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg

# Exit and reboot
exit
reboot
```

### Black Screen After Boot

```bash
# Edit GRUB entry at boot
# Press 'e' at GRUB menu
# Add to linux line:
nomodeset

# Boot with F10
# Then fix graphics drivers
```

### Check System Logs

```bash
# View system logs
journalctl -xe

# View boot messages
journalctl -b

# Follow live logs
journalctl -f
```

---

## 📚 Post-Installation Software Recommendations

### Development

```bash
sudo pacman -S code visual-studio-code-bin    # VS Code
sudo pacman -S docker docker-compose           # Docker
sudo pacman -S nodejs npm                      # Node.js
sudo pacman -S python python-pip               # Python
```

### Multimedia

```bash
sudo pacman -S vlc                # Video player
sudo pacman -S gimp               # Image editor
sudo pacman -S inkscape           # Vector graphics
sudo pacman -S obs-studio         # Screen recording
sudo pacman -S spotify            # Music (AUR: yay -S spotify)
```

### Office & Productivity

```bash
sudo pacman -S libreoffice-fresh  # Office suite
sudo pacman -S thunderbird        # Email client
sudo pacman -S calibre            # E-book manager
sudo pacman -S okular             # PDF reader
```

### System Monitoring

```bash
sudo pacman -S htop               # Process viewer
sudo pacman -S neofetch           # System info
sudo pacman -S btop               # Modern resource monitor
yay -S stacer                     # System optimizer (AUR)
```

---

## 🚀 Advanced Tips

### Automatic Backups with Timeshift

```bash
yay -S timeshift
sudo timeshift --create --comments "Fresh install"
```

### Gaming on Arch

```bash
# Install Steam
sudo pacman -S steam

# Install Lutris (for Windows games)
sudo pacman -S lutris

# Enable Proton (Steam Play)
# Settings > Steam Play > Enable Steam Play for all titles
```

### Improve Battery Life (Laptops)

```bash
# Install TLP
sudo pacman -S tlp tlp-rdw

# Enable TLP
sudo systemctl enable tlp
sudo systemctl start tlp
```

---

## 📖 Useful Commands Cheat Sheet

### Package Management

```bash
# Update system
sudo pacman -Syu

# Install package
sudo pacman -S package-name

# Remove package
sudo pacman -Rs package-name

# Search for package
pacman -Ss search-term

# Clean package cache
sudo pacman -Sc

# List installed packages
pacman -Q

# Get package info
pacman -Qi package-name
```

### System Management

```bash
# Reboot
sudo reboot

# Shutdown
sudo shutdown now

# Check system info
neofetch
uname -a

# Check disk usage
df -h

# Check memory usage
free -h

# List services
systemctl list-units --type=service

# Check service status
systemctl status service-name
```

---

## 🎯 Next Steps

1. ✅ **Customize your desktop environment**
2. ✅ **Install your favorite applications**
3. ✅ **Set up automatic backups**
4. ✅ **Configure firewall and security**
5. ✅ **Join the Arch community forums**
6. ✅ **Read the Arch Wiki** (https://wiki.archlinux.org/)

---

## 📝 Additional Resources

- **Arch Wiki:** https://wiki.archlinux.org/
- **Arch Forums:** https://bbs.archlinux.org/
- **Package Search:** https://archlinux.org/packages/
- **AUR:** https://aur.archlinux.org/
- **Reddit:** r/archlinux

---

## ⚠️ Important Notes

1. **Keep your system updated:** Run `sudo pacman -Syu` regularly
2. **Read before updating:** Check Arch Linux news for manual interventions
3. **Backup important data:** Before major system changes
4. **RTFM:** When in doubt, read the Arch Wiki
5. **Don't run commands you don't understand**

---

## 🎓 You Did It!

Congratulations! You've successfully installed Arch Linux. You now have:

- ✅ A minimal, fast Linux system
- ✅ Complete control over your OS
- ✅ The knowledge to maintain and customize it
- ✅ Bragging rights for using Arch 😎

**Welcome to the Arch Linux community!** 🐧

---

*"I use Arch, btw"* - You, now

---

## 📌 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║                    ARCH LINUX QUICK REF                    ║
╠═══════════════════════════════════════════════════════════╣
║ Install package:        sudo pacman -S package           ║
║ Update system:          sudo pacman -Syu                  ║
║ Remove package:         sudo pacman -Rs package           ║
║ Search package:         pacman -Ss search                 ║
║ Install from AUR:       yay -S package                    ║
║                                                           ║
║ Reboot:                 sudo reboot                       ║
║ Shutdown:               sudo shutdown now                 ║
║                                                           ║
║ Edit with nano:         nano filename                     ║
║ Save in nano:           Ctrl+O, Enter, Ctrl+X            ║
║                                                           ║
║ Connect WiFi:           nmcli device wifi connect SSID   ║
║                        password "password"                 ║
║                                                           ║
║ Check logs:             journalctl -xe                    ║
║ System info:            neofetch                          ║
╚═══════════════════════════════════════════════════════════╝
```

---

**Last Updated:** November 2025  
**Author:** Pro Arch Linux Guide  
**License:** Free to use and share  

*Happy Arching! 🚀*
