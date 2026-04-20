# TeamCreate

공유 작업 목록과 에이전트 간 메시징 채널을 갖춘 새로운 협업 팀을 설정합니다. 팀은 다중 에이전트 작업에 대한 조정 프리미티브입니다 — 메인 세션이 리더 역할을 하며 `Agent` 도구를 통해 명명된 팀원을 생성합니다.

## 사용 시점

- 사용자가 팀, 스웜, 크루, 또는 다중 에이전트 협업을 명시적으로 요청합니다.
- 프로젝트에 전담 전문가 (예: 프론트엔드, 백엔드, 테스트, 문서)로부터 이점을 얻는 명확히 독립적인 여러 작업 흐름이 있습니다.
- 여러 에이전트가 진행 상황을 업데이트하는 영속적인 공유 작업 목록이 필요합니다.
- 일회성 서브에이전트 호출이 아닌 `SendMessage`를 통해 메시지를 교환할 수 있는 명명된 주소 지정 가능한 팀원을 원합니다.

단일 위임 검색이나 일회성 병렬 팬아웃에는 사용하지 마십시오 — 일반 `Agent` 호출이 더 가볍고 충분합니다.

## 매개변수

- `team_name` (string, 필수): 팀의 고유 식별자. `~/.claude/teams/` 아래의 디렉토리 이름과 팀원을 생성할 때의 `team_name` 인수로 사용됩니다.
- `description` (string, 필수): 팀의 목적에 대한 짧은 진술. 생성 시 모든 팀원에게 표시되며 팀 구성에 작성됩니다.
- `agent_type` (string, 선택): 재정의하지 않는 팀원에 적용되는 기본 서브에이전트 페르소나. 일반적인 값은 `general-purpose`, `Explore`, `Plan`입니다.

## 예시

### 예시 1: 리팩터 팀 생성

```
TeamCreate(
  team_name="refactor-crew",
  description="Refactor the data access layer from raw SQL to Prisma, including migrations and tests.",
  agent_type="general-purpose"
)
```

생성 후 `team_name: "refactor-crew"`와 `db-lead`, `migrations`, `tests`와 같은 고유한 `name` 값으로 `Agent`를 사용하여 팀원을 생성합니다.

### 예시 2: 조사 팀 생성

```
TeamCreate(
  team_name="perf-investigation",
  description="Identify and rank the top three performance regressions introduced in the last release.",
  agent_type="Explore"
)
```

생성된 각 팀원은 `Explore`를 기본 페르소나로 상속하여 작업의 읽기 전용 조사 특성과 일치합니다.

## 참고사항

- 주어진 세션에서 한 번에 하나의 팀만 이끌 수 있습니다. 다른 팀을 생성하기 전에 현재 팀을 완료하거나 삭제하십시오.
- 팀은 공유 작업 목록과 1:1입니다. 리더가 작업 생성, 할당, 종료를 소유합니다. 팀원은 작업 중인 작업의 상태를 업데이트합니다.
- 팀 구성은 `~/.claude/teams/{team_name}/config.json`에 지속되며 작업 디렉토리가 그 옆에 있습니다. 이 파일은 `TeamDelete`로 명시적으로 제거될 때까지 세션을 넘어 유지됩니다.
- 팀원은 일치하는 `team_name`과 고유한 `name`으로 `Agent` 도구를 사용하여 생성됩니다. `name`은 `SendMessage`에서 사용되는 주소가 됩니다.
- 파일시스템에 안전한 `team_name`을 선택하십시오 (문자, 숫자, 대시, 밑줄). 공백이나 슬래시를 피하십시오.
- 새 팀원이 차갑게 읽으면 추가 컨텍스트 없이 팀의 목표를 이해할 수 있도록 `description`을 작성하십시오. 이것은 모든 팀원의 시작 프롬프트의 일부가 됩니다.
