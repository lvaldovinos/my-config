# my-config
My configuration module

<h2>Installation</h2>
<p>npm install my-config</p>

<h2>Example</h2>
<p>Create your configuration file (only JSON format) under any path and any name.</p>
<h3>config.json</h3>
```json
  {
	"defaults" : {
		"account-types" : ["employee" , "admin" , "cooker"],
		"database" : "example"
	},
	"dev" : {
		"database" : {
			"name" : "example dev",
			"example" : "example",
			"password" : "$Path"
		},
		"client" : {
			"name" : "example.com"
		},
		"dbshards" : [
			{
				"host" : "example.dbshard.1.com",
				"name" : "idk",
					"pass" : "123"
			},
			{
				"host" : "example.dbshard.2.com",
				"name" : "idk",
				"pass" : "$Path"
			}
		]
	},
	"test" : {
		"database" : "example qa"
	},
	"production" : {
		"database" : "example prod"
	}
}
```
<h3>Example code</h3>
```javascript
var path = require('path'),
	myconfig = require('my-config').init(path.resolve(__dirname , './config.json'));

console.log(myconfig);
```
<p>Since a NODE_ENV environment variable hasn't been set yet, <strong>dev</strong> configuration will be taken by default.</p>
<p>This would display a JSON like <strong>this:</strong></p>

```json
{
	"account-types" : ["employee" , "admin" , "cooker"],
	"database" : {
			"name" : "example dev",
			"example" : "example",
			"password" : "C:\\Windows\\system32;C:\\...."
	},
	"client" : {
			"name" : "example.com"
	},
	"dbshards" : [
			{
				"host" : "example.dbshard.1.com",
				"name" : "idk",
					"pass" : "123"
			},
			{
				"host" : "example.dbshard.2.com",
				"name" : "idk",
				"pass" : "C:\\Windows\\system32;C:\\...."
			}
		]
}
```
<h3>Defaults and Environment variables support</h3>

<p>If you want to store sensitve information inside an environment variable you can let your config file know about it and use it by just prefixing the $ symbol, for instance: </p>

```json
{
  "password" : "$DB_PASS"
}
```

<p>this would be transformed to:</p>

```json
{
  "password" : "whatever the environment variable's value is"
}
```
<p>If you have some default configuration, you can use the defaults property in your config file, like <strong>this:</strong></p>

```json
  {
	"defaults" : {
		"account-types" : ["employee" , "admin" , "cooker"],
		"database" : "example"
	},
	"dev" : {
		"database" : {
			"name" : "example dev",
			"example" : "example",
			"password" : "$Path"
		}
	}
	}
```

<p>It's important to know that any property that is being duplicated by defaults and any specific environment configuration, would be overwritten by the specific one.</p>

<p>For instance the database property within "defaults" and the database property within "dev", when you get your configuration object, you'll see something like <strong>this:</strong></p>

```json
{
	"account-types" : ["employee" , "admin" , "cooker"],
	"database" : {
			"name" : "example dev",
			"example" : "example",
			"password" : "C:\\Windows\\system32;C:\\...."
	}
}
```

<h3>Test</h3>

<code>npm test</code>

<h3>License</h3>

<p>
The MIT License (MIT)

Copyright (c) 2015 Luis Alonso Valdovinos Valencia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

</p>
