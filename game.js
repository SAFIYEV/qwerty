// Система локализации
const Languages = {
    ru: {
        title: "ZOMBIE SHOOTER 3D",
        balance: "Баланс:",
        points: "очков",
        startGame: "НАЧАТЬ ИГРУ",
        missions: "ЗАДАНИЯ",
        shop: "МАГАЗИН",
        language: "🌐 ЯЗЫК",
        back: "НАЗАД",
        ammo: "Патроны:",
        score: "Очки:",
        health: "Здоровье:",
        fire: "ОГОНЬ",
        reload: "ПЕРЕЗАРЯДКА",
        gameOver: "ИГРА ОКОНЧЕНА",
        yourScore: "Ваш счет:",
        completedMissions: "Выполненные задания:",
        playAgain: "ИГРАТЬ СНОВА",
        mainMenu: "В ГЛАВНОЕ МЕНЮ",
        gameTasks: "Игровые",
        socialTasks: "Социальные задания",
        languageTitle: "ВЫБОР ЯЗЫКА",
        missionsTitle: "ЗАДАНИЯ",
        shopTitle: "МАГАЗИН",
        gameOverTitle: "ИГРА ОКОНЧЕНА"
    },
    en: {
        title: "ZOMBIE SHOOTER 3D",
        balance: "Balance:",
        points: "points",
        startGame: "START GAME",
        missions: "MISSIONS",
        shop: "SHOP",
        language: "🌐 LANGUAGE",
        back: "BACK",
        ammo: "Ammo:",
        score: "Score:",
        health: "Health:",
        fire: "FIRE",
        reload: "RELOAD",
        gameOver: "GAME OVER",
        yourScore: "Your score:",
        completedMissions: "Completed missions:",
        playAgain: "PLAY AGAIN",
        mainMenu: "MAIN MENU",
        gameTasks: "Game Tasks",
        socialTasks: "Social Tasks",
        languageTitle: "LANGUAGE SELECTION",
        missionsTitle: "MISSIONS",
        shopTitle: "SHOP",
        gameOverTitle: "GAME OVER"
    },
    ja: {
        title: "ゾンビシューター3D",
        balance: "バランス:",
        points: "ポイント",
        startGame: "ゲーム開始",
        missions: "ミッション",
        shop: "ショップ",
        language: "🌐 言語",
        back: "戻る",
        ammo: "弾薬:",
        score: "スコア:",
        health: "体力:",
        fire: "発射",
        reload: "リロード",
        gameOver: "ゲームオーバー",
        yourScore: "あなたのスコア:",
        completedMissions: "完了したミッション:",
        playAgain: "もう一度プレイ",
        mainMenu: "メインメニュー",
        gameTasks: "ゲームタスク",
        socialTasks: "ソーシャルタスク",
        languageTitle: "言語選択",
        missionsTitle: "ミッション",
        shopTitle: "ショップ",
        gameOverTitle: "ゲームオーバー"
    }
};

let currentLanguage = 'ru';

// Функция для смены языка
function changeLanguage(lang) {
    currentLanguage = lang;
    GameData.language = lang;
    GameData.save();
    
    const langData = Languages[lang];
    
    // Обновляем главное меню
    document.getElementById('menu-title').textContent = langData.title;
    document.getElementById('balance-text').textContent = langData.balance;
    document.getElementById('points-text').textContent = langData.points;
    document.getElementById('start-btn').textContent = langData.startGame;
    document.getElementById('missions-btn').textContent = langData.missions;
    document.getElementById('shop-btn').textContent = langData.shop;
    document.getElementById('language-btn').textContent = langData.language;
    
    // Обновляем экран выбора языка
    document.getElementById('language-title').textContent = langData.languageTitle;
    document.getElementById('language-back').textContent = langData.back;
    
    // Обновляем экран заданий
    document.getElementById('missions-title').textContent = langData.missionsTitle;
    document.getElementById('game-tab').textContent = langData.gameTasks;
    document.getElementById('social-tab').textContent = langData.socialTasks;
    document.getElementById('missions-back').textContent = langData.back;
    
    // Обновляем экран магазина
    document.getElementById('shop-title').textContent = langData.shopTitle;
    document.getElementById('shop-back').textContent = langData.back;
    
    // Обновляем экран проигрыша
    document.getElementById('game-over-title').textContent = langData.gameOverTitle;
    document.getElementById('your-score-text').textContent = langData.yourScore;
    document.getElementById('completed-missions-text').textContent = langData.completedMissions;
    document.getElementById('restart-btn').textContent = langData.playAgain;
    document.getElementById('menu-btn').textContent = langData.mainMenu;
    
    // Обновляем игровой интерфейс
    document.getElementById('ammo-text').textContent = langData.ammo;
    document.getElementById('score-text').textContent = langData.score;
    document.getElementById('health-text').textContent = langData.health;
    document.getElementById('shoot-btn').textContent = langData.fire;
    document.getElementById('reload-btn').textContent = langData.reload;
}

// Сохранение данных
const GameData = {
    totalScore: 0,
    maxHealth: 100,
    damageMultiplier: 1,
    language: 'ru',
    missions: {
        // Игровые задания
        1: { killed: 0, completed: false },
        2: { score: 0, completed: false },
        3: { time: 0, completed: false },
        4: { killed: 0, completed: false },
        5: { score: 0, completed: false },
        6: { time: 0, completed: false },
        7: { killed: 0, completed: false },
        8: { score: 0, completed: false },
        9: { time: 0, completed: false },
        10: { killed: 0, completed: false },
        11: { score: 0, completed: false },
        12: { time: 0, completed: false },
        13: { time: 0, completed: false },
        14: { consecutiveKills: 0, completed: false },
        15: { distance: 0, completed: false },
        16: { efficientKills: 0, completed: false },
        17: { nightKills: 0, completed: false },
        18: { speedKills: 0, completed: false },
        19: { corners: 0, completed: false },
        20: { noReloadKills: 0, completed: false },
        21: { time: 0, completed: false },
        22: { accuracy: 0, completed: false },
        23: { score: 0, completed: false },
        // Социальные задания
        s1: { completed: false },
        s2: { completed: false },
        s3: { completed: false },
        s4: { completed: false },
        s5: { completed: false }
    },
    
    save() {
        localStorage.setItem('zombieShooterData', JSON.stringify({
            totalScore: this.totalScore,
            maxHealth: this.maxHealth,
            damageMultiplier: this.damageMultiplier,
            language: this.language,
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
            this.language = parsed.language || 'ru';
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
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js не загружен!');
        }
        
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
        this.shootSound.addEventListener('error', (e) => {
            console.warn('Не удалось загрузить звук выстрела:', e);
        });
        
        // Загрузка текстуры земли
        const textureLoader = new THREE.TextureLoader();
        this.groundTexture = textureLoader.load('texture.png', 
            // Функция успешной загрузки
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(4, 4);
                // Обновляем материал пола после загрузки текстуры
                if (this.floor) {
                    this.floor.material.map = texture;
                    this.floor.material.needsUpdate = true;
                }
            },
            // Функция прогресса загрузки
            (progress) => {
                console.log('Загрузка текстуры: ' + (progress.loaded / progress.total * 100) + '%');
            },
            // Функция ошибки
            (error) => {
                console.error('Ошибка загрузки текстуры:', error);
                // Создаем простую текстуру по умолчанию
                this.groundTexture = null;
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
        this.trees = [];
        this.rocks = [];
        
        // Переменные для новых заданий
        this.consecutiveKills = 0;
        this.totalDistance = 0;
        this.lastPosition = null; // Будет инициализировано в setupPlayer()
        this.shotsFired = 0;
        this.shotsHit = 0;
        this.speedKillTimer = 0;
        this.speedKillCount = 0;
        this.visitedCorners = new Set();
        this.noReloadKills = 0;
        this.startAmmo = 30;
        
        // Управление
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canShoot = true;
        
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
        // Создание неба
        const skyGeometry = new THREE.SphereGeometry(50, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);

        // Создание пола с текстурой
        const floorGeometry = new THREE.PlaneGeometry(100, 100);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: this.groundTexture || null,
            roughness: 0.8,
            color: 0x666666 // Цвет по умолчанию, пока текстура не загрузится
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.scene.add(this.floor);
        
        // Создание ландшафта (темно-зеленые прямоугольники)
        const terrainGeometry = new THREE.PlaneGeometry(20, 20);
        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a472a,
            roughness: 0.9
        });
        
        // Первая база
        const base1 = new THREE.Mesh(terrainGeometry, terrainMaterial);
        base1.position.set(-15, 0.1, -15);
        base1.rotation.x = -Math.PI / 2;
        this.scene.add(base1);
        
        // Вторая база
        const base2 = new THREE.Mesh(terrainGeometry, terrainMaterial);
        base2.position.set(15, 0.1, 15);
        base2.rotation.x = -Math.PI / 2;
        this.scene.add(base2);

        // Добавление деревьев
        for (let i = 0; i < 20; i++) {
            // Создаем группу для дерева
            const tree = new THREE.Group();
            
            // Создаем ствол
            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2f10 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1;
            tree.add(trunk);
            
            // Создаем крону (несколько слоев)
            const crownLayers = 3;
            for (let j = 0; j < crownLayers; j++) {
                const crownGeometry = new THREE.ConeGeometry(0.8 - j * 0.2, 1.5, 8);
                const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27 });
                const crown = new THREE.Mesh(crownGeometry, crownMaterial);
                crown.position.y = 2 + j * 0.8;
                tree.add(crown);
            }
            
            // Случайное размещение деревьев
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 15;
            tree.position.x = Math.cos(angle) * distance;
            tree.position.z = Math.sin(angle) * distance;
            
            // Добавляем случайный поворот для разнообразия
            tree.rotation.y = Math.random() * Math.PI;
            
            this.scene.add(tree);
            this.trees.push(tree);
        }

        // Добавление камней
        for (let i = 0; i < 15; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.5);
            const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            
            // Случайное размещение камней
            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 15;
            rock.position.x = Math.cos(angle) * distance;
            rock.position.z = Math.sin(angle) * distance;
            rock.position.y = 0.25;
            
            this.scene.add(rock);
            this.rocks.push(rock);
        }
    }
    
    setupLights() {
        // Усиленное фоновое освещение для дневного эффекта
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        // Основной солнечный свет
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);
        
        // Дополнительный свет для лучшего освещения
        const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
        secondaryLight.position.set(-5, 8, -5);
        this.scene.add(secondaryLight);
    }
    
    setupPlayer() {
        this.camera.position.y = 1.6; // Высота глаз
        this.camera.position.z = 5;
        
        // Инициализация начальной позиции для отслеживания расстояния
        this.lastPosition = this.camera.position.clone();
        
        // Создание оружия
        const gunGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.3);
        const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.gun = new THREE.Mesh(gunGeometry, gunMaterial);
        
        // Позиционирование оружия относительно камеры
        this.gun.position.set(0.3, -0.2, -0.5);
        this.camera.add(this.gun);
        this.scene.add(this.camera);
    }
    
    setupControls() {
        // Настройка джойстика
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
            
            // Ограничение движения джойстика
            const maxDistance = 35;
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);
            const angle = Math.atan2(deltaY, deltaX);
            
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            
            joystickHead.style.transform = `translate(${moveX}px, ${moveY}px)`;
            
            // Обновление движения игрока
            this.moveForward = moveY < -10;
            this.moveBackward = moveY > 10;
            this.moveLeft = moveX < -10;
            this.moveRight = moveX > 10;
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
            joystickHead.style.transform = '';
            this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false;
        });
        
        // Управление поворотом камеры
        let isRotating = false;
        let lastTouchX = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1 && !isDragging) {
                const touch = e.touches[0];
                // Проверяем, что касание не в области джойстика и кнопок
                const joystickArea = document.getElementById('joystick-area');
                const actionButtons = document.getElementById('action-buttons');
                
                const joystickRect = joystickArea.getBoundingClientRect();
                const buttonsRect = actionButtons.getBoundingClientRect();
                
                if (!this.isPointInRect(touch.clientX, touch.clientY, joystickRect) &&
                    !this.isPointInRect(touch.clientX, touch.clientY, buttonsRect)) {
                    isRotating = true;
                    lastTouchX = touch.clientX;
                }
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isRotating && e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - lastTouchX;
                
                // Поворот камеры по горизонтали с улучшенной чувствительностью
                this.camera.rotation.y -= deltaX * 0.008;
                
                // Ограничиваем поворот камеры
                if (this.camera.rotation.y > Math.PI) {
                    this.camera.rotation.y -= 2 * Math.PI;
                } else if (this.camera.rotation.y < -Math.PI) {
                    this.camera.rotation.y += 2 * Math.PI;
                }
                
                lastTouchX = touch.clientX;
            }
        });
        
        document.addEventListener('touchend', () => {
            isRotating = false;
        });
        
        // Кнопка стрельбы
        const shootBtn = document.getElementById('shoot-btn');
        shootBtn.addEventListener('touchstart', () => this.shoot());
        
        // Кнопка перезарядки
        const reloadBtn = document.getElementById('reload-btn');
        reloadBtn.addEventListener('touchstart', () => this.reload());
    }
    
    isPointInRect(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
    
    shoot() {
        if (!this.canShoot || this.ammo <= 0) return;
        
        // Воспроизведение звука выстрела
        this.shootSound.currentTime = 0;
        this.shootSound.play();
        
        this.ammo--;
        this.shotsFired++;
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
    }
    
    reload() {
        if (this.ammo === 30) return;
        
        // Сброс счетчика убийств без перезарядки
        this.noReloadKills = 0;
        
        // Анимация перезарядки
        setTimeout(() => {
            this.ammo = 30;
            document.getElementById('ammo-count').textContent = this.ammo;
            // this.playSound('reload');
        }, 1500);
    }
    
    spawnZombie() {
        // Создание зомби
        const zombieGeometry = new THREE.BoxGeometry(0.6, 1.8, 0.3);
        const zombieMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const zombie = new THREE.Mesh(zombieGeometry, zombieMaterial);
        
        // Случайная позиция появления
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
                // Уменьшаем урон от зомби
                this.health -= 0.1;
                document.getElementById('health-count').textContent = Math.ceil(this.health);
                
                if (this.health <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.position.add(bullet.velocity);
            
            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                if (bullet.position.distanceTo(zombie.position) < 1) {
                    this.scene.remove(bullet);
                    this.bullets.splice(i, 1);
                    
                    zombie.health -= 50 * GameData.damageMultiplier;
                    if (zombie.health <= 0) {
                        this.scene.remove(zombie);
                        this.zombies.splice(j, 1);
                        this.score += 100;
                        this.zombiesKilled++;
                        this.shotsHit++;
                        this.consecutiveKills++;
                        this.noReloadKills++;
                        this.speedKillCount++;
                        document.getElementById('score-count').textContent = this.score;
                        
                        // Обновление прогресса заданий
                        this.updateMissions();
                    }
                    break;
                }
            }
            
            if (bullet.position.length() > 50) {
                this.scene.remove(bullet);
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updateMovement() {
        const speed = 0.05; // Уменьшаем скорость движения
        const direction = new THREE.Vector3();
        
        // Сохраняем текущую позицию
        const oldPosition = this.camera.position.clone();
        
        // Обновляем позицию
        if (this.moveForward) this.camera.position.z -= speed;
        if (this.moveBackward) this.camera.position.z += speed;
        if (this.moveLeft) this.camera.position.x -= speed;
        if (this.moveRight) this.camera.position.x += speed;
        
        // Отслеживаем пройденное расстояние
        if (this.lastPosition) {
            const distance = this.camera.position.distanceTo(this.lastPosition);
            this.totalDistance += distance;
        }
        this.lastPosition = this.camera.position.clone();
        
        // Проверяем посещение углов карты
        this.checkCorners();
        
        // Проверяем коллизии с деревьями
        for (const tree of this.trees) {
            const distance = this.camera.position.distanceTo(tree.position);
            if (distance < 1.5) {
                this.camera.position.copy(oldPosition);
            }
        }
        
        // Проверяем коллизии с камнями
        for (const rock of this.rocks) {
            const distance = this.camera.position.distanceTo(rock.position);
            if (distance < 1) {
                this.camera.position.copy(oldPosition);
            }
        }
    }
    
    checkCorners() {
        const corners = [
            { x: -40, z: -40 },
            { x: 40, z: -40 },
            { x: -40, z: 40 },
            { x: 40, z: 40 }
        ];
        
        corners.forEach((corner, index) => {
            const distance = this.camera.position.distanceTo(new THREE.Vector3(corner.x, 0, corner.z));
            if (distance < 5 && !this.visitedCorners.has(index)) {
                this.visitedCorners.add(index);
                if (GameData.missions[19]) {
                    GameData.missions[19].corners = this.visitedCorners.size;
                }
            }
        });
    }
    
    updateMissions() {
        // Задание 1: Убить 10 зомби
        if (GameData.missions[1] && !GameData.missions[1].completed) {
            GameData.missions[1].killed = this.zombiesKilled;
            if (this.zombiesKilled >= 10) {
                this.completeMission(1);
            }
        }
        
        // Задание 2: Набрать 1000 очков
        if (GameData.missions[2] && !GameData.missions[2].completed && this.score >= 1000) {
            this.completeMission(2);
        }
        
        // Задание 14: Снайпер (50 убийств подряд)
        if (GameData.missions[14] && !GameData.missions[14].completed) {
            GameData.missions[14].consecutiveKills = this.consecutiveKills;
            if (this.consecutiveKills >= 50) {
                this.completeMission(14);
            }
        }
        
        // Задание 15: Бегун (1000 метров)
        if (GameData.missions[15] && !GameData.missions[15].completed) {
            GameData.missions[15].distance = Math.floor(this.totalDistance);
            if (this.totalDistance >= 1000) {
                this.completeMission(15);
            }
        }
        
        // Задание 16: Экономист (20 зомби менее чем 100 патронами)
        if (GameData.missions[16] && !GameData.missions[16].completed) {
            if (this.shotsFired <= 100 && this.zombiesKilled >= 20) {
                this.completeMission(16);
            }
        }
        
        // Задание 17: Ночной охотник (30 зомби после 5 минут)
        if (GameData.missions[17] && !GameData.missions[17].completed && this.gameTime >= 300) {
            GameData.missions[17].nightKills = this.zombiesKilled;
            if (this.zombiesKilled >= 30) {
                this.completeMission(17);
            }
        }
        
        // Задание 18: Скорострел (10 зомби за 30 секунд)
        if (GameData.missions[18] && !GameData.missions[18].completed) {
            this.speedKillTimer += 0.016; // Примерно 60 FPS
            if (this.speedKillTimer <= 30) {
                GameData.missions[18].speedKills = this.speedKillCount;
                if (this.speedKillCount >= 10) {
                    this.completeMission(18);
                }
            } else {
                this.speedKillTimer = 0;
                this.speedKillCount = 0;
            }
        }
        
        // Задание 20: Берсерк (100 зомби без перезарядки)
        if (GameData.missions[20] && !GameData.missions[20].completed) {
            GameData.missions[20].noReloadKills = this.noReloadKills;
            if (this.noReloadKills >= 100) {
                this.completeMission(20);
            }
        }
        
        // Задание 22: Мастер точности (90% точность)
        if (GameData.missions[22] && !GameData.missions[22].completed && this.shotsFired > 0) {
            const accuracy = (this.shotsHit / this.shotsFired) * 100;
            GameData.missions[22].accuracy = Math.floor(accuracy);
            if (accuracy >= 90) {
                this.completeMission(22);
            }
        }
        
        // Задание 23: Легенда (100000 очков)
        if (GameData.missions[23] && !GameData.missions[23].completed) {
            GameData.missions[23].score = this.score;
            if (this.score >= 100000) {
                this.completeMission(23);
            }
        }
    }
    
    completeMission(missionId) {
        const rewards = {
            1: 500, 2: 1000, 3: 2000, 4: 1500, 5: 3000, 6: 4000, 7: 5000, 8: 7500, 9: 10000, 10: 12000,
            11: 15000, 12: 20000, 13: 50000, 14: 8000, 15: 3000, 16: 4000, 17: 6000, 18: 5000, 19: 2500,
            20: 15000, 21: 25000, 22: 12000, 23: 100000
        };
        
        GameData.missions[missionId].completed = true;
        GameData.totalScore += rewards[missionId] || 1000;
        GameData.save();
        
        const missionElement = document.querySelector(`.mission[data-id="${missionId}"]`);
        if (missionElement) {
            const claimBtn = missionElement.querySelector('.claim-btn');
            if (claimBtn) {
                claimBtn.disabled = false;
            }
        }
    }
    
    animate() {
        if (this.isGameOver) return;
        
        requestAnimationFrame(() => this.animate());
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.gameTime += deltaTime;
        
        // Обновление времени для заданий выживания
        if (GameData.missions[3] && !GameData.missions[3].completed) {
            GameData.missions[3].time = this.gameTime;
            if (this.gameTime >= 300) { // 5 минут
                this.completeMission(3);
            }
        }
        
        if (GameData.missions[21] && !GameData.missions[21].completed) {
            GameData.missions[21].time = this.gameTime;
            if (this.gameTime >= 3600) { // 1 час
                this.completeMission(21);
            }
        }
        
        this.updateMovement();
        this.updateZombies();
        this.updateBullets();
        this.updateMissions();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    gameOver() {
        this.isGameOver = true;
        
        // Добавляем очки в общий баланс
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
    
    // Загружаем сохраненный язык
    if (GameData.language) {
        changeLanguage(GameData.language);
    }
    
    const menu = document.getElementById('menu');
    const missions = document.getElementById('missions');
    const shop = document.getElementById('shop');
    const language = document.getElementById('language');
    
    menu.classList.add('active');
    
    // Обработчики кнопок получения наград
    document.querySelectorAll('.claim-btn').forEach(btn => {
        const missionId = btn.closest('.mission').dataset.id;
        if (GameData.missions[missionId] && GameData.missions[missionId].completed) {
            btn.disabled = true;
            btn.textContent = 'Получено';
        }
        
        btn.addEventListener('click', () => {
            if (GameData.missions[missionId] && GameData.missions[missionId].completed) {
                const rewards = {
                    1: 500, 2: 1000, 3: 2000, 4: 1500, 5: 3000, 6: 4000, 7: 5000, 8: 7500, 9: 10000, 10: 12000,
                    11: 15000, 12: 20000, 13: 50000, 14: 8000, 15: 3000, 16: 4000, 17: 6000, 18: 5000, 19: 2500,
                    20: 15000, 21: 25000, 22: 12000, 23: 100000,
                    s1: 2000, s2: 2000, s3: 2500, s4: 3000, s5: 1500
                };
                
                GameData.totalScore += rewards[missionId] || 1000;
                GameData.save();
                GameData.updateUI();
                
                btn.disabled = true;
                btn.textContent = 'Получено';
                
                alert(`Поздравляем! Вы получили ${rewards[missionId]} очков!`);
            }
        });
    });
    
    // Кнопка шаринга
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Zombie Shooter 3D',
                text: 'Попробуй крутой шутер с зомби! Я уже набрал ' + GameData.totalScore + ' очков!',
                url: window.location.href
            });
        } else {
            // Запасной вариант для браузеров без API шаринга
            const shareText = `Zombie Shooter 3D - Попробуй крутой шутер с зомби! Я уже набрал ${GameData.totalScore} очков!\n${window.location.href}`;
            navigator.clipboard.writeText(shareText)
                .then(() => alert('Ссылка скопирована в буфер обмена!'))
                .catch(() => alert('Не удалось скопировать ссылку'));
        }
        });
    }
    
    // Обработчики кнопок меню
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
        menu.classList.remove('active');
        try {
            new ZombieShooter();
        } catch (error) {
            console.error('Ошибка при запуске игры:', error);
            alert('Ошибка при запуске игры. Проверьте консоль для деталей.');
            menu.classList.add('active');
        }
        });
    }
    
    const missionsBtn = document.getElementById('missions-btn');
    if (missionsBtn) {
        missionsBtn.addEventListener('click', () => {
            menu.classList.remove('active');
            missions.classList.add('active');
            updateMissionsUI();
        });
    }
    
    const shopBtn = document.getElementById('shop-btn');
    if (shopBtn) {
        shopBtn.addEventListener('click', () => {
            menu.classList.remove('active');
            shop.classList.add('active');
            updateShopUI();
        });
    }
    
    document.getElementById('language-btn').addEventListener('click', () => {
        menu.classList.remove('active');
        language.classList.add('active');
    });
    
    document.getElementById('missions-back').addEventListener('click', () => {
        missions.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('shop-back').addEventListener('click', () => {
        shop.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('language-back').addEventListener('click', () => {
        language.classList.remove('active');
        menu.classList.add('active');
    });
    
    document.getElementById('menu-btn').addEventListener('click', () => {
        document.getElementById('game-over').classList.remove('active');
        menu.classList.add('active');
    });
    
    // Обработчики кнопок выбора языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
            language.classList.remove('active');
            menu.classList.add('active');
        });
    });
    
    // Обработчики покупок в магазине
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.shop-item').dataset.id;
            buyItem(itemId);
        });
    });
    
    // Обработчики вкладок заданий
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех вкладок
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.missions-list').forEach(list => list.classList.remove('active-tab'));
            
            // Добавляем активный класс к выбранной вкладке
            btn.classList.add('active');
            const tabName = btn.dataset.tab;
            document.getElementById(`${tabName}-missions`).classList.add('active-tab');
        });
    });
});



function updateMissionsUI() {
    Object.entries(GameData.missions).forEach(([id, mission]) => {
        const missionElement = document.querySelector(`.mission[data-id="${id}"]`);
        if (missionElement) {
            const claimBtn = missionElement.querySelector('.claim-btn');
            const progressElement = missionElement.querySelector('.progress');
            
            if (id <= 23 && !id.startsWith('s') && progressElement) { // Игровые задания
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
                    case '14':
                        progressElement.textContent = `${mission.consecutiveKills}/50`;
                        break;
                    case '15':
                        progressElement.textContent = `${mission.distance}/1000м`;
                        break;
                    case '16':
                        progressElement.textContent = `${mission.efficientKills}/20 зомби`;
                        break;
                    case '17':
                        progressElement.textContent = `${mission.nightKills}/30`;
                        break;
                    case '18':
                        progressElement.textContent = `${mission.speedKills}/10`;
                        break;
                    case '19':
                        progressElement.textContent = `${mission.corners}/4 угла`;
                        break;
                    case '20':
                        progressElement.textContent = `${mission.noReloadKills}/100`;
                        break;
                    case '21':
                        const hours = Math.floor(mission.time / 3600);
                        const mins = Math.floor((mission.time % 3600) / 60);
                        const secs = Math.floor(mission.time % 60);
                        progressElement.textContent = 
                            `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}/1:00:00`;
                        break;
                    case '22':
                        progressElement.textContent = `${mission.accuracy}%/90%`;
                        break;
                    case '23':
                        progressElement.textContent = `${mission.score}/100000`;
                        break;
                }
            }
            
            if (mission.completed && claimBtn) {
                claimBtn.disabled = true;
                claimBtn.textContent = 'Получено';
            }
        }
    });
}

function updateShopUI() {
    document.querySelectorAll('.shop-item').forEach(item => {
        const buyBtn = item.querySelector('.buy-btn');
        if (buyBtn) {
            const itemId = item.dataset.id;
            const price = itemId === '1' ? 1000 : 2000;
            
            buyBtn.disabled = GameData.totalScore < price;
        }
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

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Обновляем размер canvas при изменении размера окна
    const canvas = document.getElementById('game');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
