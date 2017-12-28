const Main = {
  init() {
    Main.peticionAjax( 'https://api.github.com/users/baumannzone', function ( data ) {
      data = JSON.parse( data );
      if ( data.email ) {
        Main.pintaDatos( data );
      }
      else {
        Main.peticionAjax( "https://api.github.com/users/baumannzone/events", function ( data_events ) {
          // https://regex101.com/r/gm32zb/1/codegen?language=javascript
          let emails = [];
          const regex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
          let m;
          while ( (m = regex.exec( data_events )) !== null ) {
            // This is necessary to avoid infinite loops with zero-width matches
            if ( m.index === regex.lastIndex ) {
              regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach( function ( match, groupIndex ) {
              const badEmails = [ "git@github.com", "badges@fossa.io" ];
              if ( badEmails.indexOf( match ) === -1 ) {
                emails.push( match );
              }
            } );
          }

          // https://stackoverflow.com/a/14438954
          function onlyUnique( value, index, self ) {
            return self.indexOf( value ) === index;
          }

          data.email = emails.filter( onlyUnique );
          Main.pintaDatos( data );
        } );
      }
    } );
  },

  peticionAjax( url, cb ) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if ( xmlHttp.readyState === 4 ) {
        if ( xmlHttp.status === 200 ) {
          cb( xmlHttp.responseText );
        }
        else {
          console.error( "ERROR! 404" );
          console.info( JSON.parse( xmlHttp.responseText ) );
        }
      }
    };
    xmlHttp.open( "GET", url, true );
    xmlHttp.send();
  },

  pintaDatos( data ) {
    document.getElementById( 'resultados' )
      .innerHTML = `<h1 id="title" class="hidden">🔥I LIKE IT AWESOME, AS MY CSS 😎🎩</h1>
      <a href="http://github.com/baumannzone/awesomico-css">
        <img class="ribbon" src="assets/ribbon.png" alt="fork me on github">
      </a>
      <img class="profile" src="${data.avatar_url}">
      <p class="animation-9">Name: <span>${data.name} (${data.login})</span></p>
      <p class="animation-2">Email: <span>${data.email ? Array.isArray( data.email ) ? data.email.join( ', ' ) : data.email : "Not found"}</span></p>
      <p class="animation-3">Bio: <span>${data.bio}</span></p>
      <p class="animation-4">Blog: <span>${data.blog}</span></p>
      <p class="animation-5">Company: <span>${data.company}</span></p>
      <p class="animation-6">Vanity Rank: <span>${data.followers} | ${data.following} - ${Math.random().toFixed( 2, )}</span></p>
      <p class="animation-7">Impact Rank: <span>${data.public_repos} | ${data.public_gists} - ${Math.random().toFixed( 2, )}</span></p>
      <p class="animation-8">Hireable: <span>${data.hireable}</span></p>
      <p class="animation-1">Location: <span>${data.location}</span></p>`;

    Main.hoverLayer();
  },

  hoverLayer() {
    const resultados = document.getElementById( 'resultados' );
    const title = document.getElementById( 'title' );
    const audio = document.getElementById( 'audio' );
    resultados.addEventListener( 'mouseenter', function () {
      resultados.classList.add( 'awesome' );
      title.classList.remove( 'hidden' );
      audio.play();
    } );
    resultados.addEventListener( 'mouseleave', function () {
      resultados.classList.remove( 'awesome' );
      title.classList.add( 'hidden' );
      audio.pause();
    } );
  },
};

Main.init();