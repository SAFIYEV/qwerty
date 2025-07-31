// Сохранение данных
const GameData = {
    totalScore: 0,
    maxHealth: 100,
    damageMultiplier: 1,
    missions: {
        1: { killed: 0, completed: false },
        2: { score: 0, completed: false },
        3: { time: 0, completed: false },
        6: { killed: 0, completed: false },
        7: { score: 0, completed: false },
        8: { time: 0, completed: false },
        9: { multiKill: 0, completed: false },
        10: { reloads: 0, completed: false },
        11: { killed: 0, completed: false },
        12: { timeNoDamage: 0, completed: false },
        13: { bullets: 0, completed: false },
        14: { score: 0, completed: false },
        15: { streak: 0, completed: false },
        16: { completed: false },
        17: { completed: false },
        18: { completed: false },
        19: { completed: false },
        20: { completed: false }
    },
    
    save() {
        localStorage.setItem('zombieShooterData', JSON.stringify({
            totalScore: this.totalScore,
            maxHealth: this.maxHealth,
            damageMultiplier: this.damageMultiplier,
            missions: this.missions
        }));
    },
    
    load() {
        const data = localStorage.getItem('zombieShooterData');
        if (data) {
            const parsed = JSON.parse(data);
            this.totalScore = parsed.totalScore;
            this.maxHealth = parsed.maxHealth;
            this.damageMultiplier = parsed.damageMultiplier;
            this.missions = parsed.missions;
        }
        this.updateUI();
    },
    
    updateUI() {
        document.getElementById('total-score').textContent = this.totalScore;
    }
};

class ZombieShooter {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game'),
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        
        // Загрузка звука выстрела
        this.shootSound = new Audio('pistolet_zvuk.mp3');
        
        // Загрузка текстуры земли
        const textureLoader = new THREE.TextureLoader();
        this.groundTexture = textureLoader.load('texture.png', 
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 4);
                if (this.floor) {
                    this.floor.material.map = texture;
                    this.floor.material.needsUpdate = true;
                }
            },
            (progress) => {
                console.log('Загрузка текстуры: ' + (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Ошибка загрузки текстуры:', error);
            }
        );
        
        // Игровые переменные
        this.score = 0;
        this.health = GameData.maxHealth;
        this.ammo = 30;
        this.isGameOver = false;
        this.zombies = [];
        this.bullets = [];
        this.gameTime = 0;
        this.zombiesKilled = 0;
        this.reloadCount = 0;
        this.bulletsSpent = 0;
        this.noDamageTime = 0;
        this.killStreak = 0;
        this.maxKillStreak = 0;
        
        // Управление
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canShoot = true;
        this.isRotating = false;
        this.rotationDirection = 0;
        
        // Настройка сцены
        this.setupScene();
        this.setupLights();
        this.setupPlayer();
        this.setupControls();
        
        // Запуск игры
        this.lastTime = performance.now();
        this.animate();
        this.spawnZombies();
    }
    
    setupScene() {
        const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: this.groundTexture,
            roughness: 0.8,
            color: 0x666666
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);
        
        const terrainGeometry = new THREE.PlaneGeometry(20, 20);
        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a472a,
            roughness: 0.9
        });
        
        const base1 = new THREE.Mesh(terrainGeometry, terrainMaterial);
        base1.position.set(-15, 0.1, -15);
        base1.rotation.x = -Math.PI / 2;
        this.scene.add(base1);
        
        const base2 = new THREE.Mesh(terrainGeometry, terrainMaterial);
        base2.position.set(15, 0.1, 15);
        base2.rotation.x = -Math.PI / 2;
        this.scene.add(base2);

        for (let i = 0; i < 20; i++) {
            const tree = new THREE.Group();
            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f10 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1;
            tree.add(trunk);
            
            const crownLayers = 3;
            for (let j = 0; j < crownLayers; j++) {
                const crownGeometry = new THREE.ConeGeometry(0.8 - j * 0.2, 1.5, 8);
                const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
                const crown = new THREE.Mesh(crownGeometry, crownMaterial);
                crown.position.y = 2 + j * 0.8;
                tree.add(crown);
            }
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 15;
            tree.position.x = Math.cos(angle) * distance;
            tree.position.z = Math.sin(angle) * distance;
            tree.rotation.y = Math.random() * Math.PI;
            
            this.scene.add(tree);
            this.trees = this.trees || [];
            this.trees.push(tree);
        }

        for (let i = 0; i < 15; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.5);
            const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 15;
            rock.position.x = Math.cos(angle) * distance;
            rock.position.z = Math.sin(angle) * distance;
            rock.position.y = 0.25;
            
            this.scene.add(rock);
            this.rocks = this.rocks || [];
            this.rocks.push(rock);
        }
    }
    
    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);
        
        const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
        secondaryLight.position.set(-5, 8, -5);
        this.scene.add(secondaryLight);
    }
    
    setupPlayer() {
        this.camera.position.y = 1.6;
        this.camera.position.z = 5;
        
        const gunGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
        const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.gun = new THREE.Mesh(gunGeometry, gunMaterial);
        
        this.gun.position.set(0.3, -0.2, -0.5);
        this.camera.add(this.gun);
        this.scene.add(this.camera);
    }
    
    setupControls() {
        const joystick = document.getElementById('joystick');
        const joystickHead = document.getElementById('joystick-head');
        let isDragging = false;
        let startX, startY;
        
        joystick.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            const maxDistance = 35;
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            
            joystickHead.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            this.moveForward = moveY < -10;
            this.moveBackward = moveY > 10;
            this.moveLeft = moveX < -10;
            this.moveRight = moveX > 10;
            
            // Поворот головы
            this.rotationDirection = moveX / maxDistance;
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
            joystickHead.style.transform = '';
            this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false;
            this.rotationDirection = 0;
        });
        
        const shootBtn = document.getElementById('shoot-btn');
        shootBtn.addEventListener('touchstart', () => this.shoot());
        
        const reloadBtn = document.getElementById('reload-btn');
        reloadBtn.addEventListener('touchstart', () => this.reload());
    }
    
    shoot() {
        if (!this.canShoot || this.ammo <= 0) return;
        
        this.shootSound.currentTime = 0;
        this.shootSound.play();
        
        this.ammo--;
        this.bulletsSpent++;
        document.getElementById('ammo-count').textContent = this.ammo;
        
        const bulletGeometry = new THREE.SphereGeometry(0.05);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        
        bullet.position.copy(this.camera.position);
        bullet.rotation.copy(this.camera.rotation);
        
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        bullet.velocity = direction.multiplyScalar(0.7);
        
        this.bullets.push(bullet);
        this.scene.add(bullet);
        
        this.canShoot = false;
        setTimeout(() => this.canShoot = true, 250);
        
        // Обновление миссии 13
        if (!GameData.missions[13].completed) {
            GameData.missions[13].bullets = this.bulletsSpent;
            if (this.bulletsSpent >= 100) {
                this.completeMission(13);
            }
        }
    }
    
    reload() {
        if (this.ammo === 30) return;
        
        setTimeout(() => {
            this.ammo = 30;
            this.reloadCount++;
            document.getElementById('ammo-count').textContent = this.ammo;
            
            // Обновление миссии 10
            if (!GameData.missions[10].completed) {
                GameData.missions[10].reloads = this.reloadCount;
                if (this.reloadCount >= 20) {
                    this.completeMission(10);
                }
            }
        }, 1500);
    }
    
    spawnZombie() {
        const zombieGeometry = new THREE.BoxGeometry(0.6, 1.8, 0.3);
        const zombieMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const zombie = new THREE.Mesh(zombieGeometry, zombieMaterial);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 10;
        zombie.position.x = Math.cos(angle) * distance;
        zombie.position.z = Math.sin(angle) * distance;
        zombie.position.y = 0.9;
        
        zombie.health = 100;
        this.zombies.push(zombie);
        this.scene.add(zombie);
    }
    
    spawnZombies() {
        setInterval(() => {
            if (this.zombies.length < 10 && !this.isGameOver) {
                this.spawnZombie();
            }
        }, 3000);
    }
    
    updateZombies() {
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const zombie = this.zombies[i];
            
            const direction = new THREE.Vector3();
            direction.subVectors(this.camera.position, zombie.position).normalize();
            zombie.position.add(direction.multiplyScalar(0.03));
            
            zombie.lookAt(this.camera.position);
            
            if (zombie.position.distanceTo(this.camera.position) < 1.5) {
                this.health -= 0.1;
                this.noDamageTime = 0;
                document.getElementById('health-count').textContent = Math.ceil(this.health);
                
                if (this.health <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateBullets() {
        let zombiesHitByBullet = 0;
        
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.position.add(bullet.velocity);
            
            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                if (bullet.position.distanceTo(zombie.position) < 1) {
                    zombiesHitByBullet++;
                    zombie.health -= 50 * GameData.damageMultiplier;
                    
                    if (zombie.health <= 0) {
                        this.scene.remove(zombie);
                        this.zombies.splice(j, 1);
                        this.score += 100;
                        this.zombiesKilled++;
                        this.killStreak++;
                        this.maxKillStreak = Math.max(this.maxKillStreak, this.killStreak);
                        
                        document.getElementById('score-count').textContent = this.score;
                        
                        // Обновление миссий
                        if (!GameData.missions[1].completed) {
                            GameData.missions[1].killed = this.zombiesKilled;
                            if (this.zombiesKilled >= 10) {
                                this.completeMission(1);
                            }
                        }
                        
                        if (!GameData.missions[6].completed) {
                            GameData.missions[6].killed = this.zombiesKilled;
                            if (this.zombiesKilled >= 50) {
                                this.completeMission(6);
                            }
                        }
                        
                        if (!GameData.missions[11].completed) {
                            GameData.missions[11].killed = this.zombiesKilled;
                            if (this.zombiesKilled >= 100) {
                                this.completeMission(11);
                            }
                        }
                        
                        if (!GameData.missions[15].completed) {
                            GameData.missions[15].streak = this.maxKillStreak;
                            if (this.maxKillStreak >= 5) {
                                this.completeMission(15);
                            }
                        }
                        
                        if (!GameData.missions[2].completed && this.score >= 1000) {
                            this.completeMission(2);
                        }
                        
                        if (!GameData.missions[7].completed && this.score >= 5000) {
                            this.completeMission(7);
                        }
                        
                        if (!GameData.missions[14].completed && this.score >= 10000) {
                            this.completeMission(14);
                        }
                    }
                }
            }
            
            if (zombiesHitByBullet >= 3 && !GameData.missions[9].completed) {
                this.completeMission(9);
            }
            
            if (bullet.position.length() > 50) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateMovement() {
        const speed = 0.05;
        const rotationSpeed = 0.05;
        const direction = new THREE.Vector3();
        
        const oldPosition = this.camera.position.clone();
        
        if (this.moveForward) this.camera.position.z -= speed;
        if (this.moveBackward) this.camera.position.z += speed;
        if (this.moveLeft) this.camera.position.x -= speed;
        if (this.moveRight) this.camera.position.x += speed;
        
        // Поворот камеры
        this.camera.rotation.y -= this.rotationDirection * rotationSpeed;
        
        if (this.trees) {
            for (const tree of this.trees) {
                const distance = this.camera.position.distanceTo(tree.position);
                if (distance < 1.5) {
                    this.camera.position.copy(oldPosition);
                }
            }
        }
        
        if (this.rocks) {
            for (const rock of this.rocks) {
                const distance = this.camera.position.distanceTo(rock.position);
                if (distance < 1) {
                    this.camera.position.copy(oldPosition);
                }
            }
        }
    }
    
    completeMission(missionId) {
        const rewards = {
            1: 500,
            2: 1000,
            3: 2000,
            6: 2000,
            7: 3000,
            8: 4000,
            9: 1500,
            10: 1000,
            11: 5000,
            12: 2500,
            13: 1500,
            14: 6000,
            15: 2000
        };
        
        GameData.missions[missionId].completed = true;
        GameData.totalScore += rewards[missionId];
        GameData.save();
        
        const missionElement = document.querySelector(`.mission[data-id="${missionId}"]`);
        if (missionElement) {
            const claimBtn = missionElement.querySelector('.claim-btn');
            claimBtn.disabled = false;
        }
    }
    
    animate() {
        if (this.isGameOver) return;
        
        requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.gameTime += deltaTime;
        if (this.health === GameData.maxHealth) {
            this.noDamageTime += deltaTime;
        }
        
        // Обновление времени для заданий
        if (!GameData.missions[3].completed) {
            GameData.missions[3].time = this.gameTime;
            if (this.gameTime >= 300) {
                this.completeMission(3);
            }
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = Math.floor(this.gameTime % 60);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}/5:00`;
            document.querySelector('.mission[data-id="3"] .progress').textContent = timeString;
        }
        
        if (!GameData.missions[8].completed) {
            GameData.missions[8].time = this.gameTime;
            if (this.gameTime >= 600) {
                this.completeMission(8);
            }
            const minutes = Math.floor(this.gameTime / 60);
            const seconds = Math.floor(this.gameTime % 60);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}/10:00`;
            document.querySelector('.mission[data-id="8"] .progress').textContent = timeString;
        }
        
        if (!GameData.missions[12].completed) {
            GameData.missions[12].timeNoDamage = this.noDamageTime;
            if (this.noDamageTime >= 120) {
                this.completeMission(12);
            }
            const minutes = Math.floor(this.noDamageTime / 60);
            const seconds = Math.floor(this.noDamageTime % 60);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}/2:00`;
            document.querySelector('.mission[data-id="12"] .progress').textContent = timeString;
        }
        
        this.updateMovement();
        this.updateZombies();
        this.updateBullets();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    gameOver() {
        this.isGameOver = true;
        
        GameData.totalScore += this.score;
        GameData.save();
        
        document.getElementById('game-over').classList.add('active');
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('completed-missions').textContent = 
            Object.values(GameData.missions).filter(m => m.completed).length;
    }
}

// Инициализация игры
window.addEventListener('load', () => {
    GameData.load();
    
    const menu = document.getElementById('menu');
    const missions = document.getElementById('missions');
    const shop = document.getElementById('shop');
    
    menu.classList.add('active');
    
    // Обработчики социальных заданий
    document.querySelectorAll('.social-claim').forEach(btn => {
        const missionId = btn.closest('.mission').dataset.id;
        if (GameData.missions[missionId].completed) {
            btn.disabled = true;
            btn.textContent = 'Получено';
        }
        
        btn.addEventListener('click', () => {
            if (missionId === '16') {
                if (confirm('Вы подписались на канал @SokoInu?')) {
                    completeSocialMission(16, 1500);
                }
            } else if (missionId === '17') {
                if (confirm('Вы подписались на канал @tonsocietycahub?')) {
                    completeSocialMission(17, 1500);
                }
            } else if (missionId === '18') {
                if (confirm('Вы подписались на @SokoinuTON в X?')) {
                    completeSocialMission(18, 1000);
                }
            } else if (missionId === '19') {
                if (confirm('Вы подписались на YouTube канал RealSokoInu?')) {
                    completeSocialMission(19, 1000);
                }
            } else if (missionId === '20') {
                completeSocialMission(20, 1000);
            }
        });
    });
    
    // Кнопка шаринга
    document.querySelector('.share-btn').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Zombie Shooter 3D',
                text: 'Попробуй крутой шутер с зомби! Я уже набрал ' + GameData.totalScore + ' очков!',
                url: window.location.href
            });
        } else {
            const shareText = `Zombie Shooter 3D - Попробуй крутой шутер с зомби! Я уже набрал ${GameData.totalScore} очков!\n${window.location.href}`;
            navigator.clipboard.writeText(shareText)
                .then(() => alert('Ссылка скопирована в буфер обмена!'))
                .catch(() => alert('Не удалось скопировать ссылку'));
        }
    });
    
    // Обработчики кнопок меню
    document.getElementById('start-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        new ZombieShooter();
    });
    
    document.getElementById('missions-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        missions.classList.add('active');
        updateMissionsUI();
    });
    
    document.getElementById('shop-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        shop.classList.add('active');
        updateShopUI();
    });
    
    document.getElementById('language-btn').addEventListener('click', () => {
        const lang = prompt('Выберите язык (en, ru, ja):');
        if (lang === 'en') {
            window.location.reload(); // Английский по умолчанию
        } else if (lang === 'ru') {
            // Переключение на русский
            document.querySelectorAll('[data-ru]').forEach(el => {
                el.textContent = el.dataset.ru;
            });
        } else if (lang === 'ja') {
            // Переключение на японский
            document.querySelectorAll('[data-ja]').forEach(el => {
                el.textContent = el.dataset.ja;
            });
        }
    });
    
    document.getElementById('missions-back').addEventListener('click', () => {
        missions.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('shop-back').addEventListener('click', () => {
        shop.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('menu-btn').addEventListener('click', () => {
        document.getElementById('game-over').classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('play-again').addEventListener('click', () => {
        document.getElementById('game-over').classList.remove('active');
        new ZombieShooter();
    });
    
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.shop-item').dataset.id;
            buyItem(itemId);
        });
    });
});

function completeSocialMission(missionId, reward) {
    if (!GameData.missions[missionId].completed) {
        GameData.missions[missionId].completed = true;
        GameData.totalScore += reward;
        GameData.save();
        GameData.updateUI();
        
        const btn = document.querySelector(`.mission[data-id="${missionId}"] .social-claim`);
        btn.disabled = true;
        btn.textContent = 'Получено';
        
        alert(`Поздравляем! Вы получили ${reward} очков!`);
    }
}

function updateMissionsUI() {
    Object.entries(GameData.missions).forEach(([id, mission]) => {
        const missionElement = document.querySelector(`.mission[data-id="${id}"]`);
        if (missionElement) {
            const claimBtn = missionElement.querySelector('.claim-btn');
            
            if (id <= 15) {
                const progressElement = missionElement.querySelector('.progress');
                switch (id) {
                    case '1':
                        progressElement.textContent = `${mission.killed}/10`;
                        break;
                    case '2':
                        progressElement.textContent = `${mission.score}/1000`;
                        break;
                    case '3':
                        const minutes = Math.floor(mission.time / 60);
                        const seconds = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${minutes}:${seconds.toString().padStart(2, '0')}/5:00`;
                        break;
                    case '6':
                        progressElement.textContent = `${mission.killed}/50`;
                        break;
                    case '7':
                        progressElement.textContent = `${mission.score}/5000`;
                        break;
                    case '8':
                        const minutes8 = Math.floor(mission.time / 60);
                        const seconds8 = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${minutes8}:${seconds8.toString().padStart(2, '0')}/10:00`;
                        break;
                    case '9':
                        progressElement.textContent = `${mission.multiKill}/1`;
                        break;
                    case '10':
                        progressElement.textContent = `${mission.reloads}/20`;
                        break;
                    case '11':
                        progressElement.textContent = `${mission.killed}/100`;
                        break;
                    case '12':
                        const minutes12 = Math.floor(mission.timeNoDamage / 60);
                        const seconds12 = Math.floor(mission.timeNoDamage % 60);
                        progressElement.textContent = 
                            `${minutes12}:${seconds12.toString().padStart(2, '0')}/2:00`;
                        break;
                    case '13':
                        progressElement.textContent = `${mission.bullets}/100`;
                        break;
                    case '14':
                        progressElement.textContent = `${mission.score}/10000`;
                        break;
                    case '15':
                        progressElement.textContent = `${mission.streak}/5`;
                        break;
                }
            }
            
            if (mission.completed) {
                claimBtn.disabled = true;
                claimBtn.textContent = 'Получено';
            }
        }
    });
}

function updateShopUI() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const buyBtn = item.querySelector('.buy-btn');
        const itemId = item.dataset.id;
        const price = itemId === '1' ? 1000 : 2000;
        
        buyBtn.disabled = GameData.totalScore < price;
    });
}

function buyItem(itemId) {
    const prices = {
        1: 1000,
        2: 2000
    };
    
    const price = prices[itemId];
    if (GameData.totalScore >= price) {
        GameData.totalScore -= price;
        
        switch (itemId) {
            case '1':
                GameData.maxHealth += 20;
                break;
            case '2':
                GameData.damageMultiplier *= 1.25;
                break;
        }
        
        GameData.save();
        GameData.updateUI();
        updateShopUI();
    }
}

window.addEventListener('resize', () => {
    const game = document.querySelector('canvas').parentNode.__vue__;
    if (!game) return;
    
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
});
