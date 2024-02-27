# area-siritori

## 開発環境

### 1. WSL

※バージョンは参考値

```
C:\Users\oktnt>wsl --version
WSL バージョン: 2.1.0.0
カーネル バージョン: 5.15.137.3-1
WSLg バージョン: 1.0.59
MSRDC バージョン: 1.2.4677
Direct3D バージョン: 1.611.1-81528511
DXCore バージョン: 10.0.25131.1002-220531-1700.rs-onecore-base2-hyp
Windows バージョン: 10.0.22631.3155
```

### 2. Linux distribution
Ubuntu or Debian

### 3. 開発ツール

[asdf](https://asdf-vm.com/)
```
❯ asdf --version
v0.14.0-ccdd47d
```

#### asdf の Plguin  
1. nodejs
```
❯ asdf plugin-add nodejs
Plugin named nodejs already added
```
2. bun
```
❯ asdf plugin-add bun nodejs
Plugin named bun already added
```

3. .tool-versions のバージョンをインストールする  
area-siritori/ 下で
```
❯ asdf install
bun 1.0.29 is already installed
nodejs 20.11.1 is already installed
```

4. pnpm をインストールする  
area-siritori/ 下で
```
❯ npm i -g pnpm

changed 1 package in 541ms

1 package is looking for funding
  run `npm fund` for details
Reshimming asdf nodejs...
```

#### その他ソフトウェア

1. lsof  
socket がつながった状態で開発サーバを止めてもプロセスが残るので、残留プロセスを調べるのに使う

```
❯ sudo apt install lsof
```

### 4. 開発環境の起動・停止

1. フロントエンド  
area-siritori/area-siritori-frontend/ 下で
```
❯ pnpm install # 初回のみ
❯ pnpm dev     # Ctrl + C で停止
# ブラウザで http://localhost:5173/ にアクセスする
```

2. バックエンド  
area-siritori/area-siritori-backend/ 下で
```
❯ pnpm install # 初回のみ
❯ pnpm dev     # Ctrl + C で停止
# http://localhost:8080 で起動している
# 停止してもプロセスが残って再起動ができない場合、以下のコマンドで残留プロセスを kill してください
# lsof -i:8080 -Fp | sed 's/^p//' | xargs kill -9
```
