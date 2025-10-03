# App Auth Home

Projeto de exemplo demonstrando um fluxo de autenticação e uma home com feed, construído com React Native e Expo.

## Como rodar

1.  Clone o repositório::
    ```bash
    git clone https://github.com/gabriel-cardoso-oliveira/app-auth-home.git
    cd app-auth-home
    ```
2.  Instale as dependências:
    ```bash
    yarn
    ```
3.  Inicie o projeto:
    ```bash
    yarn start
    ```

Após iniciar o servidor, o Expo Dev Client abrirá no seu terminal. Você pode:

- Escanear o QR Code com o aplicativo Expo Go (Android) ou o aplicativo de Câmera (iOS).
- Pressionar `a` para abrir no emulador Android.
- Pressionar `i` para abrir no simulador iOS.
- Pressionar `w` para abrir no seu navegador web.

## Stack

- Expo + TypeScript + Expo Router
- Tamagui para a UI
- Zustand para gerenciamento de estado
- AsyncStorage + SecureStore para persistência de dados
- Axios para requisições HTTP
- Jest e React Native Testing Library para testes

## Decisões de Arquitetura

- **Atomic Design:** A estrutura de componentes segue os princípios do Atomic Design para maior reuso e manutenibilidade.
- **Interceptors com Delay:** Uso de interceptors no Axios para simular latência de rede e melhorar a experiência de usuário em cenários de loading.
- **Cache Offline:** Implementação de um sistema de cache para que o feed da home funcione mesmo sem conexão com a internet.

## O que foi implementado

- Fluxo de **criação de senha** com login automático.
- Funcionalidades de **Login**, **Logout** e **Restore** de sessão.
- **Home** com Skeleton-loading, exibição de feed e suporte a modo offline.

## Scripts

- `yarn test`: Roda os testes unitários e de integração em modo watch.
- `yarn lint`: Executa o linter para verificar a qualidade do código.

```bash
# Executa os testes em modo "watch"
yarn test

# Executa os testes e gera um relatório de cobertura
yarn test:coverage
```

## Próximos passos

- Adicionar testes E2E com Detox.
- Implementar internacionalização (i18n).
- Adicionar um sistema leve de telemetria para monitoramento.
