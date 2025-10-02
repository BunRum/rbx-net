--Compiled with roblox-ts v1.3.3
local TS = require(script.Parent.Parent.rbxts_include.RuntimeLib)
local _internal = TS.import(script, script.Parent.Parent, "internal")
local getRemoteOrThrow = _internal.getRemoteOrThrow
local IS_SERVER = _internal.IS_SERVER
local waitForRemote = _internal.waitForRemote
local ClientMiddlewareEvent = TS.import(script, script.Parent, "ClientMiddlewareEvent").default
--[[
	*
	 * Interface for client listening events
	 
]]
--[[
	*
	 * Interface for client sender events
	 
]]
local ClientEvent
do
	local super = ClientMiddlewareEvent
	ClientEvent = setmetatable({}, {
		__tostring = function()
			return "ClientEvent"
		end,
		__index = super,
	})
	ClientEvent.__index = ClientEvent
	function ClientEvent.new(...)
		local self = setmetatable({}, ClientEvent)
		return self:constructor(...) or self
	end
	function ClientEvent:constructor(name, configuration, middlewares, item)
		if middlewares == nil then
			middlewares = {}
		end
		self.configuration = configuration
		print(middlewares, item, "candy cookie")
		local _array = {}
		local _length = #_array
		table.move(middlewares, 1, #middlewares, _length + 1, _array)
		super.constructor(self, _array)
		self.instance = getRemoteOrThrow("RemoteEvent", name)
		local _arg0 = not IS_SERVER
		assert(_arg0, "Cannot fetch NetClientEvent on the server!")
	end
	function ClientEvent:GetInstance()
		return self.instance
	end
	function ClientEvent:Wait(name, configuration, middlewares)
		if middlewares == nil then
			middlewares = {}
		end
		return TS.Promise.defer(TS.async(function(resolve)
			TS.await(waitForRemote("RemoteEvent", name, 60))
			resolve(ClientEvent.new(name, configuration, middlewares))
		end))
	end
	function ClientEvent:SendToServer(...)
		local args = { ... }
		self.instance:FireServer(unpack(args))
	end
	function ClientEvent:Connect(callback)
		local remoteId = self.instance.Name
		local microprofile = self.configuration.MicroprofileCallbacks
		-- const modifiedcallback = callback as unknown as ((player: Player, ...args: ConnectArgs) => void)
		if microprofile then
			return self.instance.OnClientEvent:Connect(function(...)
				local args = { ... }
				debug.profilebegin("Net: " .. remoteId)
				-- this._processMiddleware()
				local modifed = args
				local _result = self:_processMiddleware(callback)
				if _result ~= nil then
					_result(unpack(modifed))
				end
			end)
		else
			print("im invincible")
			return self.instance.OnClientEvent:Connect(function(...)
				local args = { ... }
				local modifed = args
				local _result = self:_processMiddleware(callback)
				if _result ~= nil then
					_result(unpack(modifed))
				end
			end)
		end
	end
end
local default = ClientEvent
return {
	default = default,
}
