import { useEffect, useReducer } from "react";

const Word = ({ word }) => {
    return (
        <span className="word">
        {Object.entries(word).map(([key, value], index) => (
            <span className="char" key={key}>
            {value}
            </span>
            )
        )}
        </span>
    );
};

const splitPhrase = (phrase) => {
    let index = 1;
    let split = phrase.split(" ");
    return {
        unloaded: split.map((c, i) => {
            return {
                id: c + i,
                value: c.split("").reduce(
                    (r, o) => ({
                        ...r,
                        ...{ ["key" + index++]: o }
                    }),
                    {}
                    )
                };
            }
        ),
        loaded: [
            {
                id: split[0] + 0,
                value: []
            }
        ]
    };
};

const Title = ({ string }) => {
    const [{ unloaded, loaded }, setStrings] = useReducer(
        (state, action) => ({ ...state, ...action }),
        splitPhrase(string)
        );
        
    useEffect(() => {
        if (unloaded.length === 0) return;
        
        const timer = setTimeout(() => {
            if (loaded[0].id) {
                const key = Object.keys(unloaded[0].value)[0];
                loaded[loaded.length - 1].value[key] = unloaded[0].value[key];
                delete unloaded[0].value[key];
            } else {
                unloaded.unshift(unloaded[0]);
            }
            
            if (!Object.keys(unloaded[0].value).length) {
                unloaded.shift();
                if (unloaded.length) {
                    loaded.push({
                        id: unloaded[0].id,
                        value: []
                    });
                }
            }
            setStrings({ loaded, unloaded });
        }, 100);
        
        return () => clearTimeout(timer);
    });
    
    return (
        <h1 className="title">
        {
            loaded.map(({ id, value }, index) => (
                <Word word={value} key={id} />
            ))
        }
        </h1>
    );
};

export default Title;
