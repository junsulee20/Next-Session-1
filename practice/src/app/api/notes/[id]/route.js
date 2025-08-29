import { NextResponse } from 'next/server';
import { notes } from '../route';

/**
 * @openapi
 * /api/notes/{id}:             // 엔드포인트: /api/notes/뒤에 {id}가 붙는 URL
 *   get:                       // GET /api/notes/{id}
 *     summary: ID로 특정 노트 조회
 *     description: ID를 사용하여 특정 노트 하나를 조회합니다.
 *     parameters:              // API에 필요한 파라미터 정의
 *       - in: path             // URL 경로 안에 들어있는 파라미터
 *         name: id             // 파라미터 이름은 'id'
 *         required: true       // 반드시 있어야 한다.
 *         schema:
 *           type: integer     # 이 파라미터는 '정수' 타입이다.
 *         description: 조회할 노트의 ID
 *     responses:
 *       '200':                 // 정상적으로 찾았을 때
 *         description: 요청한 노트 정보를 반환합니다.
 *       '404':                 // 못 찾았을 때
 *         description: 해당 ID의 노트를 찾을 수 없습니다.
 *   put:
 *     summary: 특정 노트 전체 수정(치환)
 *     description: ID를 사용하여 특정 노트의 전체 값을 치환합니다. 본 실습에서는 title만 관리합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 노트의 ID
 *     requestBody:             // 요청 바디: 수정할 제목을 담아야 함
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 수정된 노트 제목
 *     responses:
 *       '200':
 *         description: 성공적으로 수정된 노트 정보를 반환합니다.
 *       '404':
 *         description: 해당 ID의 노트를 찾을 수 없습니다.
 *   delete:                    // DELETE /api/notes/{id}
 *     summary: 특정 노트 삭제
 *     description: ID를 사용하여 특정 노트를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 노트의 ID
 *     responses:
 *       '204':                 // 삭제 성공 (204 = No Content)
 *         description: 성공적으로 노트가 삭제되었습니다.
 *       '404':
 *         description: 해당 ID의 노트를 찾을 수 없습니다.
 */

// ---------------------------------------------
// URL에서 마지막 segment(id 값)를 정수로 추출하는 함수
// ex) http://localhost:3000/api/notes/5 → id=5 (number)
// ---------------------------------------------

//  params.id 대신 request.url을 직접 파싱하는 함수
// 이유: Next.js의 동적 라우트에서는 params가 비동기적으로 준비되기도 해서
//       "params.id를 바로 쓰지 말고 await 해야 한다"는 에러가 날 수 있음.
//       반면 request.url은 항상 문자열로 들어오기 때문에 직접 파싱하면 안전하다.
function getIdFromUrl(url) {
    try {
        const u = new URL(url);
        const parts = u.pathname.split('/');
        return parseInt(parts[parts.length - 1], 10);
    } catch {
        return NaN;
    }
}


// ---------------------------------------------
// GET /api/notes/{id}
// - 특정 id의 노트를 찾아 반환
// - 없으면 404 Not Found
// ---------------------------------------------
export async function GET(request) {
    const id = getIdFromUrl(request.url);
    const note = notes.find((n) => n.id === id);

    if (!note) {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
}

export async function PUT(request) {
    const { title } = await request.json();
    const id = getIdFromUrl(request.url);
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // PUT: 전체 리소스 치환(본 실습 모델은 id, title만 관리)
    notes[noteIndex] = { id, title: title.trim() };

    return NextResponse.json(notes[noteIndex]);
}

// ---------------------------------------------
// DELETE /api/notes/{id}
// - 특정 id의 노트를 삭제
// - 없으면 404 Not Found
// - 성공 시 204 No Content (본문 없음) 반환
// ---------------------------------------------
export async function DELETE(request) {
    const id = getIdFromUrl(request.url);
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
        return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    notes.splice(noteIndex, 1); // 배열에서 해당 노트 제거

    return new NextResponse(null, { status: 204 });
}
