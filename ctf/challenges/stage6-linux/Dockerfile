FROM debian:12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssh-server cron \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/run/sshd

# Low-privilege account - credentials recovered from stage4-crypto's memo
RUN useradd -m -s /bin/bash mcole && echo 'mcole:Sh4d0wR3l4y!' | chpasswd

# Root-only flag
RUN echo 'OBSIDIAN{cr0n_scr1pt_pr1v3sc}' > /root/flag.txt \
    && chown root:root /root/flag.txt \
    && chmod 600 /root/flag.txt

# World-writable script driven by a root cron job every minute
COPY files/cleanup.sh /opt/cleanup.sh
RUN chown root:root /opt/cleanup.sh && chmod 777 /opt/cleanup.sh
RUN echo '* * * * * root /opt/cleanup.sh' > /etc/cron.d/cleanup \
    && chmod 644 /etc/cron.d/cleanup

RUN sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config \
    && sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

# Home-lab style banners instead of default Debian/game text
COPY files/motd /etc/motd
COPY files/ssh_banner /etc/ssh_banner
RUN echo 'Banner /etc/ssh_banner' >> /etc/ssh/sshd_config

COPY files/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 22
ENTRYPOINT ["/entrypoint.sh"]
