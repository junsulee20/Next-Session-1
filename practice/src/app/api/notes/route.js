import { NextResponse } from 'next/server';

/**
 * @openapi                      // 👉 이 블록 주석은 Swagger/OpenAPI 스펙
 * /api/notes:                   // 이 파일이 담당하는 API 경로 (엔드포인트): /api/notes
 *   get:                        // GET 메서드 정의: "노트 목록을 조회하는 API"
 *     summary: 모든 노트 목록 조회     // Swagger 문서에서 보이는 한 줄 설명
 *     description: 저장된 모든 노트의 목록을 가져온다. // 좀 더 자세한 설명
 *     responses:                 // 이 API가 반환할 수 있는 응답들
 *       '200':                   // HTTP 상태 코드 200 OK
 *         description: 성공적으로 노트 목록을 반환한다.
 *         content:               // 응답 내용 정의
 *           application/json:    // JSON 형식으로 응답한다.
 *             schema:            // 응답 JSON의 구조
 *               type: array      // 최상위 데이터 타입은 "배열"
 *               items:           // 배열의 각 요소는…
 *                 type: object   // 객체 형태
 *                 properties:    // 객체가 가지는 속성들
 *                   id:          // id 필드
 *                     type: integer
 *                     example: 1
 *                   title:       // title 필드
 *                     type: string
 *                     example: 첫 번째 노트
 *   post:                       // POST 메서드 정의: "새 노트 생성 API"
 *     summary: 새 노트 생성
 *     description: 새로운 노트를 목록에 추가한다.
 *     requestBody:              // 요청 바디 설명
 *       required: true          // 요청 본문이 필수임
 *       content:
 *         application/json:
 *           schema:             // 요청 JSON 구조
 *             type: object
 *             properties:
 *               title:          // title 속성 필수
 *                 type: string
 *                 example: 새로 추가할 노트 제목
 *     responses:
 *       '201':                  // HTTP 상태 코드 201 Created
 *         description: 성공적으로 노트가 생성되었으며, 생성된 노트를 반환한다.
 */

// ---------------------------------------------
// 전역 상태 저장 (서버 리로드 시 초기화되는 임시 저장소)
// globalThis를 활용해서 notes 배열과 nextId 값을 유지한다.
// ---------------------------------------------
export const notes = (globalThis.notes = globalThis.notes || []);
const nextIdState = (globalThis.nextIdState = globalThis.nextIdState || { value: 1 });

// ---------------------------------------------
// GET /api/notes
// - 저장된 모든 노트를 JSON 배열로 반환한다.
// - 상태코드는 기본 200 OK.
// ---------------------------------------------
export async function GET() {
    return NextResponse.json(notes);
}

// ---------------------------------------------
// POST /api/notes
// - 요청 Body에서 title을 받아 새 노트를 추가한다.
// - 유효성 검증: title이 비어 있거나 문자열이 아니면 400 Bad Request.
// - 성공 시 새로 생성된 노트를 반환하고 상태코드는 201 Created.
// ---------------------------------------------
export async function POST(request) {
    // 요청 본문(JSON) 파싱 → { title }
    const { title } = await request.json();

    // title이 없거나 잘못된 경우 에러 반환
    if (!title || typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // 새 노트 객체 생성 (id는 자동 증가)
    const newNote = {
        id: nextIdState.value++,
        title: title.trim(),
    };

    // notes 배열에 추가
    notes.push(newNote);

    // 생성된 노트를 응답 (201 Created)
    return NextResponse.json(newNote, { status: 201 });
}