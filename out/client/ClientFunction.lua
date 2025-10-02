--Compiled with roblox-ts v1.3.3
local TS = _G[script]
local _internal = TS.import(script, script.Parent.Parent, "internal")
local getRemoteOrThrow = _internal.getRemoteOrThrow
local IS_SERVER = _internal.IS_SERVER
local waitForRemote = _internal.waitForRemote
local ClientMiddlewareFunction = TS.import(script, script.Parent, "ClientMiddlewareFunction").default
local CollectionService = game:GetService("CollectionService")
local ClientFunction
do
	local super = ClientMiddlewareFunction
	ClientFunction = setmetatable({}, {
		__tostring = function()
			return "ClientFunction"
		end,
		__index = super,
	})
	ClientFunction.__index = ClientFunction
	function ClientFunction.new(...)
		local self = setmetatable({}, ClientFunction)
		return self:constructor(...) or self
	end
	function ClientFunction:constructor(name, configuration, middlewares)
		if middlewares == nil then
			middlewares = {}
		end
		super.constructor(self, middlewares)
		self.name = name
		self.configuration = configuration
		self.instance = getRemoteOrThrow("RemoteFunction", name)
		local _arg0 = not IS_SERVER
		assert(_arg0, "Cannot create a Net.ClientFunction on the Server!")
	end
	function ClientFunction:Wait(name, configuration, middlewares)
		if middlewares == nil then
			middlewares = {}
		end
		return TS.Promise.defer(TS.async(function(resolve)
			TS.await(waitForRemote("RemoteFunction", name, 60))
			resolve(ClientFunction.new(name, configuration, middlewares))
		end))
	end
	function ClientFunction:GetInstance()
		return self.instance
	end
	function ClientFunction:CallServer(...)
		local args = { ... }
		if CollectionService:HasTag(self.instance, "NetDefaultListener") then
			error("Attempted to call Function '" .. (self.name .. "' - which has no user defined callback"))
		end
		local modifed = args
		-- return  this.instance.InvokeServer()
		-- const callback = (...argsa: unknown[]) => this.instance.InvokeServer(...argsa);
		-- const callback = this.instance.InvokeServer
		local relo = self.instance:InvokeServer(unpack(args))
		local callback = function()
			return relo
		end
		return self:_processMiddleware(callback)()
		-- const returnData = [...relo]
		-- 
		-- return this.process(returnData)
		-- return this._processMiddleware(callback) 
		-- return this._processMiddleware<CallArgs, ServerReturnType>(callback)() as;
	end
	ClientFunction.CallServerAsync = TS.async(function(self, ...)
		local args = { ... }
		return TS.Promise.defer(function(resolve)
			local result = self.instance:InvokeServer(unpack(args))
			resolve(result)
		end)
	end)
end
return {
	default = ClientFunction,
}
