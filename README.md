<p align="center">
    <img src="http://raw.pixeye.games/logo_framework.png" alt="Actors">
</p>

[![Discord](https://img.shields.io/discord/320945300892286996.svg?label=Discord)](https://discord.gg/suZuhyt)
[![Join the chat at https://gitter.im/ActorsFramework/Lobby](https://img.shields.io/badge/gitter-join%20chat-green.svg?style=flat-square)](https://gitter.im/ActorsFramework/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Twitter Follow](https://img.shields.io/badge/twitter-%40dimmPixeye-blue.svg?style=flat-square&label=Follow)](https://twitter.com/dimmPixeye)
[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/dimmpixeye/Actors-Unity3d-Framework/blob/master/LICENSE)

# ACTORS - Lightning fast ECS (Entity Component System) Framework for Unity 
ACTORS is a complete game framework with multiscene editing, game object pooling, ECS and data-driven approach for game logic explicitly built for Unity3d. It is used to ease the pain of decoupling data from behaviors without tons of boilerplate code and unnecessary overhead. 

 
### Requirements
- Unity 2018 and higher 

### How to Install
#### From packages ( Preferable )

- Create a new Unity Project
- Open the manifest.json file in the Packages folder inside of the Project
- Add ```"com.pixeye.ecs": "https://github.com/dimmpixeye/ecs.git",```

#### From Unity
- Download from https://github.com/dimmpixeye/ecs/releases 

#### How To Update
If you use packages you can automatically get fresh updates inside Unity editor!  
Press Tools->Actors->Update Framework[GIT] to get new update when needed.

## Documentation 

* [Examples](https://github.com/dimmpixeye/CryoshockMini)
* [Wiki](https://github.com/dimmpixeye/ecs/wiki)
 
## Introduction

For more information please visit the [Wiki](https://github.com/dimmpixeye/ecs/wiki).

### Components
Components are data containers without logic. In ACTORS Framework components can be either classes or structs. You should decide carefully from the start of the project what kind of layout ( class or structure ) you want to use as the workflow slightly differs.

> You can automatically create a component class/struct from a special template in Unity.  
> Project->Create->Actors->Generate->Component

#### Class Components

```csharp
	sealed class ComponentHealth
	{
		public int val;
		public int valMax;
	}
```

#### Struct Components
> To use struct components you need to add ```ACTORS_COMPONENTS_STRUCTS``` to Scripting Define Symbols in the Project Player Settings.  

```csharp
	struct ComponentHealth
	{
		public int val;
		public int valMax;
	}
```

#### Component Helper
Every component is generated with special helpers that are optional but makes your life way easier.  
If you don't use Unity for generating components, you can easily make a template in your IDE. Or type helpers manually.

```csharp
	static partial class Components
	{
		public const string Health = "Pixeye.Source.ComponentHealth";

		[RuntimeInitializeOnLoadMethod]
		static void ComponentHealthInit()
		{
			Storage<ComponentHealth>.Instance.Creator       = () => { return new ComponentHealth(); };
			Storage<ComponentHealth>.Instance.DisposeAction = DisposeComponentHealth;
		}

		/// Use this method to clean variables
		[MethodImpl(MethodImplOptions.AggressiveInlining)]
		internal static void DisposeComponentHealth(in ent entity)
		{
			ref var component = ref Storage<ComponentHealth>.Instance.components[entity.id];
		}


		[MethodImpl(MethodImplOptions.AggressiveInlining)]
		internal static ref ComponentHealth ComponentHealth(in this ent entity)
		{
			return ref Storage<ComponentHealth>.Instance.components[entity.id];
		}
	}
```

### Entity
Entity is an incremental ID that help accessing components. Entity is represented by ```ent``` structure.


#### How to create entity ?

```csharp
public void SomeMethod()
{
    // Bare entity
    ent e = Entity.Create();
}
```
___

Entities can hold information about unity objects as well!

```csharp
public void SomeMethod()
{    
     // New entity with a new GO ( GameObject ).
     // The GO prefab will be taken from the Resources folder by string ID.
     ent e = Entity.Create("Obj Fluffy Unicorn");
     // Access to the transform of Obj Fluffy Unicorn gameobject.
     e.transform.position = new Vector3(0,0,0) ;
}
```
___

```csharp
public GameObject prefabFluffyUnicorn;
public void SomeMethod()
{    
     // New entity with a new GO ( GameObject ).
     // The GO will be created from the provided prefab.
     ent e = Entity.Create(prefabFluffyUnicorn);
     // Access to the transform of Obj Fluffy Unicorn gameobject.
     e.transform.position = new Vector3(0,0,0) ;
}
```
___

You can pool gameobject by adding ```true``` variable in the end of the method.
```csharp
public void SomeMethod()
{    
     // New entity with a new GO ( GameObject ).
     // The GO prefab will be taken from the Resources folder by string ID.
     ent e = Entity.Create("Obj Fluffy Unicorn", true);
     // Access to the transform of Obj Fluffy Unicorn gameobject.
     e.transform.position = new Vector3(0,0,0) ;
}
```
___

#### How to add Components ?
There are several ways to add components depending on the context of your code.
The simpliest way is to use ```Add``` method.
```csharp
public void Some Method()
{    
     ent e = Entity.Create("Obj Bunny");
     // Add components
     var cCute       = e.Add<ComponentCute>();
     var cJumping    = e.Add<ComponentJumping>();
     var cConsumable = e.Add<ComponentConsumable>();
     var cPoo        = e.Add<ComponentCanPoo>();

     // Component Cute
     cCute.attractivness = float.PositiveInfinity;
     // Component Jumping
     cJumping.power = 100;

}
```
In case you want to setup your new entity it's better to use ```Set``` Method. Use ```Set``` method only with newly created entities.
At the end of your setup call ```Deploy``` method. 

```csharp
public void Some Method()
{    
     ent e = Entity.Create("Obj Bunny");
     // Add components
     var cCute       = e.Set<ComponentCute>();
     var cJumping    = e.Set<ComponentJumping>();
     var cConsumable = e.Set<ComponentConsumable>();
     var cPoo        = e.Set<ComponentCanPoo>();

     // Component Cute
     cCute.attractivness = float.PositiveInfinity;
     // Component Jumping
     cJumping.power = 100;

     // Send entity to the game.
     e.Deploy();
}
```

The difference between Add and Set are in the operations that Framework must do to create this object. In the example above, the Framework needs to make 4 ```ADD``` operations, but in the case of the ```SET``` method, it will make only 1 operation.

#### How to kill Entities?

```csharp
// Create new entity with Obj Bunny prefab
ent e = Entity.Create("Obj Bunny");
// Somewhere in the code
e.Release();
```

> If you create an entity with a GameObject, it will be destroyed as well. If the GameObject was marked as poolable, it will be deactivated and reused in the future.

#### How to kill Entity without touching a GameObject?
```csharp
// Create new entity with Obj Bunny prefab
ent e = Entity.Create("Obj Bunny");
// Somewhere in the code
e.Unbind();
```
