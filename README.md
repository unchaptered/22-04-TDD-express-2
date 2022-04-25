# 22-04-TDD-express-2

jest, supertest 를 이용한 TDD 연습 _ `22.04.21` ~

## Index

- [Purpose](https://github.com/unchaptered/22-04-TDD-express-2#purpose) `목표`
    - [Cause](https://github.com/unchaptered/22-04-TDD-express-2#cause) `동기`
- [Structure](https://github.com/unchaptered/22-04-TDD-express-2#1-structure) `일반 구조`
    - [Controller](https://github.com/unchaptered/22-04-TDD-express-2#11-controller)
    - [Service](https://github.com/unchaptered/22-04-TDD-express-2#11-service)
- [Custom Modules](https://github.com/unchaptered/22-04-TDD-express-2#2-custom-modules) `커스텀 모듈`
    - [Options](https://github.com/unchaptered/22-04-TDD-express-2#21-options)
    - [Token](https://github.com/unchaptered/22-04-TDD-express-2#22-token)
    - [Middleware](https://github.com/unchaptered/22-04-TDD-express-2#23-middleware)
        - [Filter](https://github.com/unchaptered/22-04-TDD-express-2#231-filter) `JWT 필터`
        - [Guard](https://github.com/unchaptered/22-04-TDD-express-2#232-guard) `매개변수 필터`
        - [Factories](https://github.com/unchaptered/22-04-TDD-express-2#24-facotries) `유틸리티 팩토리`
            - [Inject Factory](https://github.com/unchaptered/22-04-TDD-express-2#241-inject-factory) `환경변수 주입 팩토리 클래스`
            - [ResForm Factory with SuccessForm, FailureForm](https://github.com/unchaptered/22-04-TDD-express-2#242-resform-factory-with-successform-failureform) `반환객체 팩토리 클래스`
            - [Logger Factory](https://github.com/unchaptered/22-04-TDD-express-2#143-logger-factory) `로그 팩토리 클래스`
- [Databases](https://github.com/unchaptered/22-04-TDD-express-2#Databases)
- [References](https://github.com/unchaptered/22-04-TDD-express-2#References)
- [TIL](https://github.com/unchaptered/22-04-TDD-express-2#TIL)

## Purpose

- [✅] Jest 를 이용한 유닛 테스트 작성 연습
- [✅] Jest, Suertest 를 이용한 비즈니스 로직 검증
- [✅] 서버의 반환 객체의 일관성 유지 / 사용성 향상 연습
- [✅] 객체의 역할과 책임의 분리

### Cause

```
지금까지 백앤드 서버를 구현하였을 떄, 발견한 문제는 아래 세가지가 제일 많았습니다.

1. 결합도가 높아서 수정이 어렵다.

2. 서버에서 반환하는 정보가 일관성이 떨어진다.
    (예시 : 정보를 찾았을 때 / 못찾앗을 때/ 에러 발생 시의 반환할 객체의 구조가 다르다)
    
3. 서버에서 반환하는 정보의 사용성이 떨어진다.
    (예시 : 에러 알람을 보내고 이를 처리하는 과정에서 프론트엔드에서 별도의 처리 과정이 너저분하게 발쌩한다)
    (예시 : 에러 내용은 대부분 영어로 되어 있지만, 서비스 사용자에게는 한글로 보내줘야 한다)

위와 같은 문제점을 TDD & OOP 에 입각한 개발로 해결할 수 있을 것이라고 생각했습니다.
```

## 1. Structure

```
과거에는 router, controller, service 등을 비슷한 유형끼리 모았습니다.
하지만 이러한 방식이 작업의 생산성을 낮추고 수정이 어렵다는 것을 느끼게 되었습니다.

따라서 home / auth / shop(expected) 등의 폴더 안에 각기 필요한 router, controller, service 등을 넣었습니다.

router 에서는 경우에 따라 middleware, controller 를 호출하게 되고
controller 에서는 경우에 따라서 service 를 호출하여 정보를 받게 됩니다.
service 는 실제적으로 MongoDB, Redis 에 접근해서 정보를 받아오는 비동기 처리 부분을 담았습니다.
```

### 1.1 Controller

일반적인 비즈니스 로직의 흐름을 포함합니다.

### 1.2. Service

DB 작업을 담당하고 있습니다.
`MongoService` 와 `RedisService` 로 구분되어 있습니다.

## 2. Custom Modules

```
2달 전, 유투브 개발바닥에서 들은 향로님의 말이 찔렸습니다.
테스트 코드 한 줄, 객체의 역할과 책임 협력도 모르면서 TypeScript 를 사용하는 것이 의미가 없다.

실제로 DTO 는 저를 너무 불편하게 만들었고 제대로 이해하지 못한 Nest 는 전술한 문제점이 있었습니다.
그래서 여러 역할을 분리하고 캡슐화를 통해서 느슨한 상태로 만들어보도록 노력했습니다.

따라서 다음과 같은 모듈을 추가하였습니다.

1. Options
2. Token
3. Middlewares
4. Factories
```

### 2.1. Options

```
다음에 해당하는 항목을 모두 포함하고 있습니다.

1. 전역 미들웨어
2. DB 연결 함수
3. ENV 경로 설정 함수

해당 함수들은 모두 app.js 에서 호출되어 설정값을 제어하고 있습니다.

경우에 따라 필요한 인스턴스는 함수 외부에 변수를 만들어 export 하고 있습니다.
```

### 2.2. Token

```
Authentication 과정에서 빈번하게 사용될 SECRET 키 혹은 여러 함수를 캡슐화 하여 클래스에 담았습니다.
주요한 설정값은 app.js 에서 setter 와 Inject.factory(후술) 을 통해서 입력받고 있습니다.
```

### 2.3. Middleware

```
1. req.body 에 값이 들어있는 지 확인하는 `Guard`
2. req.headers 에 값이 들어있으며 유효한 지 확인하는 `Filter`
```

#### 2.3.1 Filter

```
목적에 맞게 캡슐화해 둔 JwtModule 과 ResFormFactory 를 이용하여 검증 절차를 진행합니다.

1. access.token.filter.js | 엑세스 토큰 만료 검증
2. refresh.token.filter.js | 리프레시 토큰 만료 검증
3. owner.token.filter.js | 엑세스 토큰 만료 및 발행자 검증 후 오너 여부 확인
```

#### 2.3.2. Guard

```
어떠한 매개변수의 필요 유형은 다음과 같이 구분된다고 인지했습니다.

1. 전부가 필요한 경우
2. 최소한 한 개는 필요한 경우

두 경우 모두 '존재 여부' 가 필요하므로 Set 구조와 for in 문법을 사용하여 구현하였습니다.
```

### 2.4. Facotries 

```
어떠한 일관된 데이터를 반환(생산) 한다는 역할을 하는 친구들을 별도로 모았습니다.

1. Inject Facotry | 환경변수를 반환하는 메서드들을 담았습니다.
2. ResForm Factory | 서버에서 반환 할 정보를 일관성 있게 담는 메서드를 담았습니다.
3. Logger Factory | 개발 모드 별로 다른 로그를 사용할 수 있게 만드는 메서드를 담았습니다.
```

#### 2.4.1. Inject Factory

```
이는 유틸리티 클래스로 인스턴스 생성이 불가능합니다.

config.option.js 에서 설정한 *.env.* 에 접근해 정해진 환경변수를 리턴하게 됩니다.

반환하는 환경변수는 `일반 변수 혹은 객체` 의 형태로 가공되어 있습니다.
```

#### 2.4.2. ResForm Factory with SuccessForm, FailureForm

```
`성공 및 실패를 구분할 역할` 과 이에 맞는 `객체를 생성할 역할` 을 구분하였습니다.

전자를 ResFormFactory 의 메서드가 담당하며 후자를 SuccessFOrm, FailureForm 클래스의 생성자가 담당합니다.

ResFormFactory 는 또한 유틸리티 클래스로 인스턴스 생성이 불가능합니다.
```

```javascript
class ResFormFactory {

    // ...
    
    static getSuccessForm(message, data) {
        return new SuccessForm(message, data);
    }
    
    static getFailureForm(message) {
        return new FailureForm(message);
    }
    
    // ...

}
```

#### 2.4.3. Logger Factory

```
ResForm Factory 와 같은 방식으로 구현했습니다.

단, morgan 은 devDependencies 에 있으며,
빌드 후 실행 시 morgan is devDependencies 가 발생할 것 같습니다.

해당 부분의 문제가 해결되지 않은 상태입니다.
```

<hr>

## Databases

프로젝트에는 MongoDB 와 Redis 를 사용하였습니다.

주 저장소로 MongoDB 를 사용하고 JWT RefreshToken 을 Redis 에 저장하여 사용하였습니다.
<hr>

## References

[[NHN FORWARD 2021] Redis 야무지게 사용하기](https://www.youtube.com/watch?v=92NizoBL4uA&t=1025s)

<hr>

## TIL

아직 미작성

<hr>

# Boilerplates

[**Github Repo unchpatered/express-web**](https://github.com/unchaptered/express-web) 의 보일러 플레이트를 기반으로 개발하였습니다.

1. Usage | 사용법
2. Dependencies | 의존성 모듈 항목
3. Modules' Role | 모듈별 역할

## Usage

git 혹은 npx 을 이용해서 해당 프로젝트를 사용할 수 있습니다.


### git

```
mkdir project
cd project
git clone https://github.com/unchaptered/express-web
npm i
```

### npx

```
npx degit unchaptered/express-web project
cd project
npm i
```

## Dependencies

npm i 시 문제가 생긴되면 다음의 절차를 따라주세요.

1. node_modules/ 제거
2. package-lock.json 제거
3. package.json 안에 항목 확인
4. 누락 항목을 아래 모듈에서 찾고 npm i (-D) / 혹은 전부 npm i (-D)
5. 반복

위 절차로 해결되지 않는다면 각 모듈의 버전을 확인하고 코멘트를 달아주세요.

### Dependencies

1. 필수항목 Babel, Enviroment, Application
2. 선택항목 Secure Option, DB Connection, Logger

- [✅][Babel] @babel/runtime @types/jest babel-plugin-add-module-exports

- [✅][Enviroment] dotenv

- [✅][Applications] express
- [✅][Secure Option] cors helmet bcrypt

- [✅][DB Connection] mongoose redis
- [✅][Logger] morgan winston winston-daily-rotate-file
 
### DevDependencies

1. 필수항목 Babel, Enviroment, Watcher, Test
2. 선택항목 Faker

- [✅][Babel] @babel/cli @babel/core @babel/node @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime @babel/preset-env @babel/preset-flow eslint eslint-config-airbnb-base eslint-config-prettier eslint-plugin-import eslint-plugin-jest eslint-plugin-prettier eslint-watch prettier @babel/preset-react 

- [✅][Test] jest supertest superagent supertest-as-promised node-mocks-http

- [✅][Enviroment] corss-env
- [✅][Watcher] nodemon
- [✅][Faker] faker@5.5.3

## Modules' Role

1. Develope | 어플리케이션 관련 모듈 설명
2. Settings | 개발 설정 관련 모듈 설명

### Develope

#### Applications + Secure Options

Express 공식 문서 혹은 일반적으로 사용하는 모듈들을 포함하고 있습니다.

#### DB Connection

MongoDB, Redis 를 연결하기 위해서 mongoose, redis 모듈을 설치하였습니다.
DB 환경이 다르다면 다른 모듈을 설치하면 됩니다.

#### Logger

아래에 서술한 NODE_ENV 에 따라서 별도의 Logger 를 적용하였습니다.
스위칭은 되지만 적용은 하지 않은 상태로 미확정된 부분입니다.
제거하시는 것을 권고드립니다.

### Settings

#### Cross-env / Env

배포, 개발, 테스트 환경 별로 환경변수를 별도로 설정해야 할 필요가 있습니다.

package.json script 안에 cross-env 를 이용하여 NODE_ENV 를 설정해주고
config.options.js 안에서 env 를 이용하여 NODE_ENV 별로 별도의 .env.path 를 설정해주도록 하였습니다.

#### Babel

공식문서에는 `Babel is JavaScript Compiler` 라고 소개 되어 있습니다.

_압축 및 난수화 기능을 제외하고 보겠습니다._
브라우저 환경 혹은 특정한 모듈은 아직 ES6+ 와 같은 최신 문법이 지원되지 않습니다.
따라서 해당 모듈을 사용하기 위해서는 ES5- 이전의 문법으로 컴파일 할 필요가 있습니다.

Babel 은 이러한 기능을 담당하고 있습니다.

#### Test

단위 테스트 및 통합 테스트를 하기 위하여 각각 jest, supertest 모듈을 사용하였습니다.
그 외에 추가적인 의존성 모듈을 설치하고 req, res 등의 목업을 위해서 node-mocks-http 를 사용하였습니다.

#### Watcher

Nodemon 은 프로젝트 경로 상에 있는 모든 *.js 파일을 추적하고 이 파일이 수정되면 스크립트를 재실행시켜줍니다.

#### Faker

_개발자가 최신 버전을 삭제하고 날랐기 떄문에_
Faker 는 더미 데이터 생산을 도와주는 라이브러리이며 @5.5.3 버전으로 설치하였습니다.
