
class SiteTop extends React.Component {
    render() {
        return (
            <div id="" className="analyzer-app">
                <h1 className="analyzer-app-header">
                    <span className="header-first-part">Candi</span>
                    <span className="header-second-part">date</span>
                    <span className="header-third-part">Calculator</span>
                </h1>
                <div className="app-intranavigation">
                    <a className="intrasite current" href="https://idxsupport.github.io/">Endpoint Creator</a>
                    <a className="intrasite" href="http://lain.tools:5732/analyzer.html">Candidate Calculator</a>
                </div>
            </div>
        )
    }
}
class InputLabels extends React.Component {
    render() {
        const inputFields = [
            ['URL', 'http://www.example.com/'],
            ['Target', 'Class(es)/ID/Element Name'],
            ['Title', 'Search']
        ];
        const inputLabels = inputFields.map(inputFields =>
            <div className = "row input-fields">
                <label className="badge-dark">{inputFields[0]}</label>
                <input
                    id={inputFields[0].toLowerCase()}
                    placeholder={inputFields[1]}
                    defaultValue={inputFields[1] == 'Search' ? 'Search' : ''}
                    type={inputFields[0] == 'url' ? 'url' : ''}
                />
            </div>
        );
        return <div> {inputLabels} </div>
    }
}
class App extends React.Component {
    render() {
        return (
            <div>
                <SiteTop />
                <section id="calculator">
                    <div className="app calculator">
                        <h1>Wrapper Endpoint Creators</h1>
                        <InputLabels />
                    </div>

                </section>
            </div>            
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
)