var bootstrap, r = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/').then((res) => res.json()).then((data) => bootstrap = data);
var current_date = Date.now(), current_gw = bootstrap.events.find(o => o.is_current === true)['id'];
var all_players = document.querySelectorAll('div[class^="PitchElementData__StyledPitchElementData"]');
for (let i = 0; i < all_players.length; i++) {
    var player = all_players[i].querySelector('div[class^=PitchElementData__ElementName]').innerText;
    var team = all_players[i].closest('button[class^=Utils__UnstyledButton]').querySelector('img[class^=Shirt__StyledShirt]').getAttribute('alt');
    var player_id = bootstrap.elements.find(o => o.web_name === player && o.team === bootstrap.teams.find(o => o.name === team)['id'])['id'];
    var element, r = await fetch(`https://fantasy.premierleague.com/api/element-summary/${player_id}/`).then((res) => res.json()).then((data) => element = data);
    var points_arr = [], points, points_offset = 0, fixtures = '', fixtures_offset = 0;
    for (let i = 1; i < 7 + points_offset; i++) {
        var i_points = element.history[element.history.length - i];
        if (i_points) { if (Date.parse(i_points['kickoff_time']) < current_date) { points_arr.push(i_points['total_points']); } else { points_offset += 1; } }
    }
    points = points_arr.reverse().join('-');
    for (let i = current_gw + 1; i < current_gw + 8; i++) {
        var i_fixture = element.fixtures.filter(o => o.event === i);
        if (i_fixture.length === 0) { fixtures += '⬛'; } else if (i_fixture.length === 1) {
            fixtures += { 5: '🟥', 4: '🟧', 3: '🟨', 2: '🟩', 1: '🟦' }[i_fixture[0]['difficulty']];
        } else if (i_fixture.length === 2) { fixtures += '🟪'; } else { fixtures += '🟫'; }
    }
    var node = all_players[i].querySelector('div[class^=PitchElementData__ElementValue]');
    var node_points = node.cloneNode(); node_points.innerText = points;
    var node_fixtures = node.cloneNode(); node_fixtures.innerText = fixtures;
    all_players[i].appendChild(node_points);
    if (window.location.pathname !== '/transfers') { all_players[i].appendChild(node); }
    all_players[i].appendChild(node_fixtures);
}