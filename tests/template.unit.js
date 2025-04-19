const templatePromise = import("../src/source/template.js");

const html = `
<body>    
    <script src="../jasmine/bundles/jasmine.js"></script>
<% for (let file of tests_list_paths) { %>  
        <script src="<%= file %>"></script>
<% } %>
    <script src="../jasmine/bundles/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
</body>
</html>
`;

describe("template.js main nlab", () => {
  it("html", async () => {
    const template = await templatePromise;

    const tmp = template.default(html);

    const generated = tmp({ tests_list_paths: ["one.js", "two.js"] });

    // console.log(`>${generated}<`)

    const expected = `
<body>    
    <script src="../jasmine/bundles/jasmine.js"></script>
  
        <script src="one.js"></script>
  
        <script src="two.js"></script>

    <script src="../jasmine/bundles/node_modules/jasmine-core/lib/jasmine-core/boot1.js"></script>
</body>
</html>
`;

    expect(generated).toEqual(expected);
    // expect(generated).toMatchSnapshot(expected);
  });
});
